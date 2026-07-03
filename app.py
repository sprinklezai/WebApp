import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(
    page_title="Executive Sales Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
        .reportview-container { background: #f8f9fa; }
        .kpi-card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-left: 5px solid #1E3A8A;
            text-align: center;
        }
        .kpi-val { font-size: 2rem; font-weight: bold; color: #1E3A8A; margin: 0; }
        .kpi-lbl { font-size: 0.9rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
        .stTabs [data-baseweb="tab-list"] { gap: 10px; }
        .stTabs [data-baseweb="tab"] {
            background-color: #f1f5f9;
            border-radius: 4px 4px 0px 0px;
            padding: 10px 20px;
            font-weight: 600;
        }
        .stTabs [aria-selected="true"] { background-color: #1E3A8A !important; color: white !important; }
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_data(show_spinner=False)
def load_data():
    file_map = {
        "stores": "Store_Master.xlsx",
        "brands": "Brand_Master.xlsx",
        "companies": "Company_Master.xlsx",
        "countries": "Country_Master.xlsx",
    }

    dfs = {}
    for key, filename in file_map.items():
        try:
            dfs[key] = pd.read_excel(filename)
            dfs[key].columns = [c.strip() for c in dfs[key].columns]
        except Exception as exc:
            st.warning(f"Unable to load {filename}: {exc}")
            dfs[key] = pd.DataFrame()

    return dfs["stores"], dfs["brands"], dfs["companies"], dfs["countries"]


stores_df, brands_df, companies_df, countries_df = load_data()

st.sidebar.title("🏢 Navigation")
page = st.sidebar.radio("Go to:", ["Global Overview", "Brand Dashboards"])

BRAND_LIST = [
    "Coldstone Creamery",
    "Sushi Library",
    "Nando's",
    "Allo Beirut",
    "Jamies Italian",
    "Jamies Pizzeria",
    "Wingstop",
    "Molten Chocolate Cafe",
]

if not brands_df.empty and "Brand" in brands_df.columns:
    brand_values = [str(value).strip() for value in brands_df["Brand"].dropna().unique() if str(value).strip()]
    if brand_values:
        BRAND_LIST = brand_values


if page == "Global Overview":
    st.title("📊 Enterprise Overview Dashboard")
    st.subheader("Company Profile & Global Footprint")
    st.markdown("---")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        total_stores = len(stores_df) if not stores_df.empty else 142
        st.markdown(
            f'<div class="kpi-card"><p class="kpi-val">{total_stores}</p><p class="kpi-lbl">Total Stores</p></div>',
            unsafe_allow_html=True,
        )
    with col2:
        total_companies = len(companies_df) if not companies_df.empty else 8
        st.markdown(
            f'<div class="kpi-card"><p class="kpi-val">{total_companies}</p><p class="kpi-lbl">Total Companies</p></div>',
            unsafe_allow_html=True,
        )
    with col3:
        total_brands = len(brands_df) if not brands_df.empty else len(BRAND_LIST)
        st.markdown(
            f'<div class="kpi-card"><p class="kpi-val">{total_brands}</p><p class="kpi-lbl">Total Brands</p></div>',
            unsafe_allow_html=True,
        )
    with col4:
        total_countries = len(countries_df) if not countries_df.empty else 6
        st.markdown(
            f'<div class="kpi-card"><p class="kpi-val">{total_countries}</p><p class="kpi-lbl">Countries Present</p></div>',
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    chart_col1, chart_col2 = st.columns(2)

    with chart_col1:
        st.subheader("🗺️ Stores by Country")
        if "Country" in stores_df.columns:
            country_counts = stores_df["Country"].value_counts().reset_index()
            country_counts.columns = ["Country", "Count"]
        else:
            country_counts = pd.DataFrame(
                {
                    "Country": ["UAE", "KSA", "Qatar", "Kuwait", "Oman", "Bahrain"],
                    "Count": [45, 38, 22, 18, 11, 8],
                }
            )

        fig_country = px.bar(
            country_counts,
            x="Country",
            y="Count",
            text_auto=True,
            color_discrete_sequence=["#1E3A8A"],
        )
        fig_country.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            margin=dict(t=10, b=10, l=10, r=10),
        )
        st.plotly_chart(fig_country, use_container_width=True)

    with chart_col2:
        st.subheader("🍕 Contribution by Region & Brand")
        if "Region" in stores_df.columns and "Sales" in stores_df.columns:
            region_sales = stores_df.groupby("Region")["Sales"].sum().reset_index()
        else:
            region_sales = pd.DataFrame(
                {
                    "Region": ["GCC Central", "GCC West", "Levant", "North Africa"],
                    "Sales": [450000, 320000, 150000, 950000],
                }
            )

        fig_region = px.pie(
            region_sales,
            values="Sales",
            names="Region",
            hole=0.4,
            color_discrete_sequence=px.colors.qualitative.Prism,
        )
        fig_region.update_layout(margin=dict(t=10, b=10, l=10, r=10))
        st.plotly_chart(fig_region, use_container_width=True)

    st.markdown("---")
    st.subheader("Brand Portfolios")
    st.info("Select a brand tab below or use the sidebar to view granular operational metrics.")

    tabs = st.tabs(BRAND_LIST)
    for index, brand_name in enumerate(BRAND_LIST):
        with tabs[index]:
            st.markdown(f"### {brand_name}")
            col_img, col_desc = st.columns([1, 3])
            with col_img:
                st.image(
                    f"https://placehold.co/200x150/1E3A8A/FFF?text={brand_name.replace(' ', '+')}",
                    use_container_width=True,
                )
            with col_desc:
                st.write(f"Operational performance breakdown summary view for **{brand_name}**.")
                if st.button(f"Launch {brand_name} Dashboard", key=f"btn_{index}"):
                    st.session_state.selected_brand = brand_name
                    st.info(f"Navigate to 'Brand Dashboards' in the sidebar to view {brand_name} metrics.")

else:
    st.title("📈 Brand Performance Metrics")

    default_index = 0
    if "selected_brand" in st.session_state and st.session_state.selected_brand in BRAND_LIST:
        default_index = BRAND_LIST.index(st.session_state.selected_brand)

    selected_brand = st.selectbox("Select Brand Focus Window:", BRAND_LIST, index=default_index)
    st.markdown(f"## Focus Unit: {selected_brand}")
    st.markdown("---")

    b_col1, b_col2, b_col3 = st.columns(3)
    with b_col1:
        st.metric(label="MTD Revenue Target achieved", value="$248,500", delta="+12.3%")
    with b_col2:
        st.metric(label="Average Order Value (AOV)", value="$42.50", delta="-2.1%")
    with b_col3:
        st.metric(label="Active Footfall Locations", value="14 Sites")

    st.markdown("<br>", unsafe_allow_html=True)

    st.subheader("Performance Vector Trend (Trailing 12 Months)")
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    revenue = [21000 + (len(selected_brand) * 500) + (i * 1200) for i in range(12)]

    fig_trend = go.Figure()
    fig_trend.add_trace(
        go.Scatter(
            x=months,
            y=revenue,
            mode="lines+markers",
            name="Revenue",
            line=dict(color="#1E3A8A", width=3),
        )
    )
    fig_trend.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(showgrid=True, gridcolor="#E5E7EB"),
        yaxis=dict(showgrid=True, gridcolor="#E5E7EB"),
        margin=dict(t=20, b=20, l=20, r=20),
    )
    st.plotly_chart(fig_trend, use_container_width=True)
