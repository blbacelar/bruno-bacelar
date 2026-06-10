"""
Modalyst Product Scraper - Uses existing Chrome session (Google OAuth)
======================================================================

REQUIREMENTS:
    pip install playwright pandas
    playwright install chromium

HOW TO RUN:
    1. Make sure Chrome is CLOSED before running this script (Playwright needs
       exclusive access to the Chrome profile).
    2. Adjust CHROME_PROFILE_PATH and PROFILE_NAME below for your OS.
    3. Run: python scrape_modalyst.py

NOTES:
    - You must already be logged into Modalyst at https://modalyst.co in Chrome.
    - The script connects to your real Chrome profile so no re-login is needed.
    - Results are saved to cravio_products.csv and cravio_top_picks.csv.
"""

import asyncio
import csv
import os
import platform
import random
import re
import time
from pathlib import Path

import pandas as pd
from playwright.async_api import async_playwright

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Detect OS and set default Chrome profile path
_system = platform.system()
if _system == "Darwin":
    CHROME_PROFILE_PATH = str(Path.home() / "Library/Application Support/Google/Chrome")
elif _system == "Windows":
    CHROME_PROFILE_PATH = str(Path(os.environ.get("LOCALAPPDATA", "")) / "Google/Chrome/User Data")
else:  # Linux
    CHROME_PROFILE_PATH = str(Path.home() / ".config/google-chrome")

PROFILE_NAME = "Default"

BASE_URL = "https://modalyst.co/retailer/marketplace/ready-to-sell/"

KEYWORDS = [
    "personalized cutting board",
    "walnut kitchen tools",
    "bamboo kitchen set",
    "copper measuring cups",
    "ceramic kitchen tools",
    "matte black kitchen gadgets",
    "artisan kitchen accessories",
    "engraved kitchen gift",
    "premium food prep tools",
    "modern kitchen essentials",
]

OUTPUT_FILE = "cravio_products.csv"
TOP_PICKS_FILE = "cravio_top_picks.csv"

CSV_COLUMNS = [
    "keyword_searched",
    "product_name",
    "supplier_name",
    "supplier_type",
    "supplier_rating",
    "cost_min",
    "cost_max",
    "retail_min",
    "retail_max",
    "margin_percent",
    "shipping_cost",
    "shipping_days",
    "stock_qty",
    "product_url",
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def random_delay(low: float = 2.0, high: float = 5.0) -> None:
    time.sleep(random.uniform(low, high))


def _parse_price(text: str) -> float | None:
    """Extract first float from a price string like 'CA$12.50' or '$8 - $15'."""
    if not text:
        return None
    matches = re.findall(r"[\d]+\.?[\d]*", text.replace(",", ""))
    return float(matches[0]) if matches else None


def _parse_price_range(text: str) -> tuple[float | None, float | None]:
    """Return (min, max) prices from a string like 'CA$8.00 – CA$15.00'."""
    if not text:
        return None, None
    nums = re.findall(r"[\d]+\.?[\d]*", text.replace(",", ""))
    if len(nums) >= 2:
        return float(nums[0]), float(nums[1])
    if len(nums) == 1:
        v = float(nums[0])
        return v, v
    return None, None


def _parse_rating(text: str) -> float | None:
    if not text:
        return None
    m = re.search(r"[\d]+\.?[\d]*", text)
    return float(m.group()) if m else None


def _parse_stock(text: str) -> int | None:
    if not text:
        return None
    m = re.search(r"[\d,]+", text.replace(",", ""))
    return int(m.group()) if m else None


def _parse_shipping_days(text: str) -> int | None:
    """Extract the maximum shipping days from strings like '5-7 business days'."""
    if not text:
        return None
    nums = re.findall(r"\d+", text)
    return int(nums[-1]) if nums else None


def _supplier_type_from_text(text: str) -> str:
    t = (text or "").lower()
    if "aliexpress" in t:
        return "AliExpress"
    if "alibaba" in t:
        return "Alibaba"
    return "Indie Brands"


def calc_margin(retail_min: float | None, cost_min: float | None, shipping: float | None) -> float | None:
    if retail_min and cost_min is not None and shipping is not None and retail_min > 0:
        return round(((retail_min - cost_min - shipping) / retail_min) * 100, 2)
    return None


def passes_filter(row: dict) -> bool:
    if row["supplier_type"] in ("AliExpress", "Alibaba"):
        return False
    if row["supplier_rating"] is not None and row["supplier_rating"] < 4.5:
        return False
    if row["shipping_cost"] is not None and row["shipping_cost"] > 20:
        return False
    if row["stock_qty"] is not None and row["stock_qty"] < 50:
        return False
    if row["shipping_days"] is not None and row["shipping_days"] > 14:
        return False
    return True


# ---------------------------------------------------------------------------
# Scraping logic
# ---------------------------------------------------------------------------

async def scroll_and_load(page, cycles: int = 4) -> None:
    """Scroll down several times to trigger lazy loading."""
    for _ in range(cycles):
        await page.evaluate("window.scrollBy(0, window.innerHeight * 2)")
        await page.wait_for_timeout(1500)
    # Scroll back to top so element queries are stable
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(500)


async def extract_product_cards(page, keyword: str) -> list[dict]:
    """Extract all product cards visible on the current page."""
    results = []

    # Wait for at least one product card to appear
    try:
        await page.wait_for_selector("[data-testid='product-card'], .product-card, .item-card", timeout=15000)
    except Exception:
        print(f"  [WARN] No product cards found for keyword: {keyword}")
        return results

    # Collect all card elements — Modalyst uses various class names; try broad selectors
    cards = await page.query_selector_all(
        "[data-testid='product-card'], .product-card, .item-card, "
        "article[class*='product'], div[class*='ProductCard'], div[class*='product-card']"
    )

    print(f"  Found {len(cards)} product card elements")

    for card in cards:
        try:
            row: dict = {}

            # --- Product name ---
            name_el = await card.query_selector(
                "[data-testid='product-name'], .product-name, .product-title, "
                "h3, h4, [class*='ProductName'], [class*='product-name'], [class*='title']"
            )
            row["product_name"] = (await name_el.inner_text()).strip() if name_el else None

            # --- Supplier name ---
            supplier_el = await card.query_selector(
                "[data-testid='supplier-name'], .supplier-name, [class*='SupplierName'], "
                "[class*='supplier-name'], [class*='brand']"
            )
            row["supplier_name"] = (await supplier_el.inner_text()).strip() if supplier_el else None

            # --- Supplier type (badge / label) ---
            badge_el = await card.query_selector(
                "[data-testid='supplier-type'], [class*='SupplierType'], [class*='supplier-type'], "
                "[class*='badge'], [class*='Badge'], [class*='label'], [class*='origin']"
            )
            badge_text = (await badge_el.inner_text()).strip() if badge_el else ""
            row["supplier_type"] = _supplier_type_from_text(badge_text)

            # --- Supplier rating ---
            rating_el = await card.query_selector(
                "[data-testid='rating'], [class*='Rating'], [class*='rating'], "
                "[class*='stars'], [aria-label*='rating']"
            )
            rating_text = ""
            if rating_el:
                rating_text = await rating_el.get_attribute("aria-label") or await rating_el.inner_text()
            row["supplier_rating"] = _parse_rating(rating_text)

            # --- Cost ---
            cost_el = await card.query_selector(
                "[data-testid='cost'], [class*='Cost'], [class*='cost'], "
                "[class*='wholesale'], [class*='Wholesale']"
            )
            cost_text = (await cost_el.inner_text()).strip() if cost_el else ""
            row["cost_min"], row["cost_max"] = _parse_price_range(cost_text)

            # --- Retail price ---
            retail_el = await card.query_selector(
                "[data-testid='retail-price'], [class*='RetailPrice'], [class*='retail-price'], "
                "[class*='suggested'], [class*='Suggested'], [class*='msrp'], [class*='MSRP']"
            )
            retail_text = (await retail_el.inner_text()).strip() if retail_el else ""
            row["retail_min"], row["retail_max"] = _parse_price_range(retail_text)

            # --- Stock ---
            stock_el = await card.query_selector(
                "[data-testid='stock'], [class*='Stock'], [class*='stock'], "
                "[class*='inventory'], [class*='Inventory'], [class*='qty'], [class*='Qty']"
            )
            stock_text = (await stock_el.inner_text()).strip() if stock_el else ""
            row["stock_qty"] = _parse_stock(stock_text)

            # --- Shipping cost ---
            ship_cost_el = await card.query_selector(
                "[data-testid='shipping-cost'], [class*='ShippingCost'], [class*='shipping-cost'], "
                "[class*='shipping'] span, [class*='Shipping'] span"
            )
            ship_cost_text = (await ship_cost_el.inner_text()).strip() if ship_cost_el else ""
            row["shipping_cost"] = _parse_price(ship_cost_text)

            # --- Shipping time ---
            ship_time_el = await card.query_selector(
                "[data-testid='shipping-time'], [class*='ShippingTime'], [class*='shipping-time'], "
                "[class*='delivery'], [class*='Delivery'], [class*='days']"
            )
            ship_time_text = (await ship_time_el.inner_text()).strip() if ship_time_el else ""
            row["shipping_days"] = _parse_shipping_days(ship_time_text)

            # --- Product URL ---
            link_el = await card.query_selector("a[href]")
            href = await link_el.get_attribute("href") if link_el else None
            if href and href.startswith("/"):
                href = "https://modalyst.co" + href
            row["product_url"] = href

            # --- Calculated fields ---
            row["keyword_searched"] = keyword
            row["margin_percent"] = calc_margin(row["retail_min"], row["cost_min"], row["shipping_cost"])

            results.append(row)

        except Exception as exc:
            print(f"  [WARN] Failed to parse a product card: {exc}")
            continue

    return results


async def scrape_keyword(page, keyword: str) -> list[dict]:
    url = f"{BASE_URL}?q={keyword.replace(' ', '+')}"
    print(f"\n[{keyword}] Navigating to: {url}")

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception as exc:
        print(f"  [ERROR] Navigation failed: {exc}")
        return []

    # Wait a moment for JS to hydrate
    await page.wait_for_timeout(3000)

    # Scroll to trigger lazy loading
    print(f"  Scrolling to load products...")
    await scroll_and_load(page, cycles=4)

    products = await extract_product_cards(page, keyword)
    return products


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main() -> None:
    all_products: list[dict] = []
    all_filtered: list[dict] = []

    async with async_playwright() as pw:
        print("Launching browser with existing Chrome profile...")
        print(f"  Profile path : {CHROME_PROFILE_PATH}")
        print(f"  Profile name : {PROFILE_NAME}")

        # persistent_context reuses the existing Chrome profile (cookies, session, etc.)
        context = await pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE_PATH,
            channel="chrome",           # Use system Chrome (not Chromium)
            headless=False,             # Keep visible so you can see what's happening
            args=[
                f"--profile-directory={PROFILE_NAME}",
                "--disable-blink-features=AutomationControlled",
            ],
            viewport={"width": 1280, "height": 900},
        )

        page = context.pages[0] if context.pages else await context.new_page()

        for keyword in KEYWORDS:
            products = await scrape_keyword(page, keyword)
            print(f"  Extracted {len(products)} products")

            for p in products:
                all_products.append(p)
                if passes_filter(p):
                    all_filtered.append(p)

            random_delay(2, 5)

        await context.close()

    # -------------------------------------------------------------------
    # Write CSV files
    # -------------------------------------------------------------------
    print("\n\nWriting results...")

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(all_products)

    print(f"  Saved {len(all_products)} products to {OUTPUT_FILE}")

    # Top picks: margin > 35%, Indie Brands, shipping <= 7 days, sorted desc
    top_picks = [
        p for p in all_filtered
        if p.get("margin_percent") is not None
        and p["margin_percent"] > 35
        and p.get("supplier_type") == "Indie Brands"
        and p.get("shipping_days") is not None
        and p["shipping_days"] <= 7
    ]
    top_picks.sort(key=lambda x: x["margin_percent"], reverse=True)

    with open(TOP_PICKS_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(top_picks)

    print(f"  Saved {len(top_picks)} top picks to {TOP_PICKS_FILE}")

    # -------------------------------------------------------------------
    # Summary
    # -------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total products scraped  : {len(all_products)}")
    print(f"Products after filtering: {len(all_filtered)}")
    print(f"Top picks (margin>35%%) : {len(top_picks)}")

    if top_picks:
        print("\nTop 5 products by margin:")
        for i, p in enumerate(top_picks[:5], 1):
            name = p.get("product_name") or "(unknown)"
            margin = p.get("margin_percent")
            supplier = p.get("supplier_name") or "(unknown)"
            print(f"  {i}. {name} | {supplier} | margin: {margin}%")

    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
