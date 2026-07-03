from pathlib import Path

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(
    page_title="Business Overview Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
        .stApp { background-color: #F8FAFC; }
        [data-testid="stSidebar"] {
            background-color: #114B3E !important;
        }
        [data-testid="stSidebar"] * {
            color: #FFFFFF !important;
        }
        div.row-widget.stRadio > div[role="radiogroup"] > label {
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 4px;
            transition: background 0.2s;
        }
        div.row-widget.stRadio > div[role="radiogroup"] > label:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .kpi-container {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .kpi-title {
            font-size: 0.85rem;
            color: #64748B;
            font-weight: 500;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .kpi-value {
            font-size: 1.85rem;
            font-weight: 700;
            color: #0F172A;
            margin-bottom: 2px;
        }
        .kpi-delta-positive {
            font-size: 0.8rem;
            color: #10B981;
            font-weight: 600;
        }
        .kpi-delta-span {
            color: #94A3B8;
            font-weight: 400;
        }
        .section-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .main-title { font-size: 1.75rem; font-weight: 700; color: #0F172A; }
        .sub-title { font-size: 0.85rem; color: #64748B; margin-top: -10px; margin-bottom: 25px; }
    </style>
    """,
    unsafe_allow_html=True,
)

THEME_PRIMARY = '#114B3E'
THEME_SECONDARY = '#A3E635'
THEME_MUTED = '#CBD5E1'


@st.cache_data(show_spinner=False)
def load_data():
    try:
        stores = pd.read_excel("Store_Master.xlsx")
        brands = pd.read_excel("Brand_Master.xlsx")
        companies = pd.read_excel("Company_Master.xlsx")
        countries = pd.read_excel("Country_Master.xlsx")

        for df in [stores, brands, companies, countries]:
            df.columns = [str(col).strip() for col in df.columns]

        return stores, brands, companies, countries
    except Exception as exc:
        st.warning(f"Unable to load workbook data: {exc}")
        return pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame()


stores_df, brands_df, companies_df, countries_df = load_data()

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

with st.sidebar:
    st.markdown("### 📊 ANALYZE")
    page = st.radio("", ["Global Overview", "Brand Dashboards"], label_visibility="collapsed")

if page == "Global Overview":
    st.markdown('<p class="main-title">Business Overview</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-title">All Locations · All Countries · Year to date</p>', unsafe_allow_html=True)

    kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)
    with kpi_col1:
        st.markdown(
            '''
            <div class="kpi-container">
                <div class="kpi-title">Total Stores</div>
                <div class="kpi-value">142</div>
                <div class="kpi-delta-positive">▲ 0.0% <span class="kpi-delta-span">vs prior</span></div>
            </div>
            ''',
            unsafe_allow_html=True,
        )
    with kpi_col2:
        st.markdown(
            '''
            <div class="kpi-container">
                <div class="kpi-title">Total Companies</div>
                <div class="kpi-value">8</div>
                <div class="kpi-delta-positive">▲ 0.0% <span class="kpi-delta-span">vs prior</span></div>
            </div>
            ''',
            unsafe_allow_html=True,
        )
    with kpi_col3:
        st.markdown(
            '''
            <div class="kpi-container">
                <div class="kpi-title">Total Brands</div>
                <div class="kpi-value">8</div>
                <div class="kpi-delta-positive">▲ 0.0% <span class="kpi-delta-span">vs prior</span></div>
            </div>
            ''',
            unsafe_allow_html=True,
        )
    with kpi_col4:
        st.markdown(
            '''
            <div class="kpi-container">
                <div class="kpi-title">Countries Present</div>
                <div class="kpi-value">6</div>
                <div class="kpi-delta-positive">▲ 0.0% <span class="kpi-delta-span">vs prior</span></div>
            </div>
            ''',
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.markdown(
            '<div class="section-card"><strong>Revenue Trend</strong><br><small style="color:#64748B;">Net revenue - Monthly vs prior period</small>',
            unsafe_allow_html=True,
        )
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        fig_trend = go.Figure()
        fig_trend.add_trace(
            go.Bar(name="Prior", x=months, y=[7.2, 5.1, 5.8, 6.4, 7.8, 6.9], marker_color=THEME_MUTED, width=0.25)
        )
        fig_trend.add_trace(
            go.Bar(name="Current", x=months, y=[8.67, 6.12, 6.62, 7.36, 8.94, 7.81], marker_color=THEME_PRIMARY, width=0.25)
        )
        fig_trend.update_layout(
            barmode="group",
            bargap=0.15,
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            showlegend=False,
            height=300,
            margin=dict(t=20, b=20, l=10, r=10),
            yaxis=dict(showticklabels=False, showgrid=False),
            xaxis=dict(showgrid=False),
        )
        st.plotly_chart(fig_trend, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with col_right:
        st.markdown(
            '<div class="section-card"><strong>Revenue by Region</strong><br><small style="color:#64748B;">Performance across territories</small>',
            unsafe_allow_html=True,
        )
        regions_data = pd.DataFrame(
            {
                "Region": ["United Arab Emirates", "Qatar", "Saudi Arabia", "Bahrain"],
                "Sales": [17.02, 12.20, 12.11, 4.09],
            }
        ).sort_values("Sales", ascending=True)

        fig_reg = px.bar(regions_data, y="Region", x="Sales", orientation="h", text_auto=True)
        fig_reg.update_traces(marker_color=THEME_PRIMARY, textposition="outside")
        fig_reg.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            height=300,
            margin=dict(t=20, b=20, l=10, r=10),
            xaxis=dict(showticklabels=False, showgrid=False, title=""),
            yaxis=dict(title=""),
        )
        st.plotly_chart(fig_reg, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="section-card"><strong>Locations by Sales</strong>', unsafe_allow_html=True)
    mock_table = pd.DataFrame(
        {
            "#": ["01", "02", "03", "04", "05"],
            "LOCATION": [
                "Dubai Hills",
                "Doha Festival City",
                "Doha City Centre",
                "Nakheel Mall - Riyadh",
                "Khaleej Mall - Riyadh",
            ],
            "COUNTRY": ["UAE", "Qatar", "Qatar", "Saudi", "Saudi"],
            "ADS": ["$22.7K", "$19.7K", "$15.5K", "$13.7K", "$13.3K"],
            "AVG CHECK": [180, 190, 165, 197, 188],
            "AVG DAILY TXNS": [126, 103, 94, 70, 71],
        }
    )
    st.dataframe(mock_table, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

else:
    selected_brand = st.sidebar.selectbox("Select Active Brand:", BRAND_LIST)
    st.markdown(f'<p class="main-title">{selected_brand} Dashboard</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-title">Performance analytics window focused</p>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(
            f'<div class="kpi-container"><div class="kpi-title">Average Daily Sales</div><div class="kpi-value">$10.9K</div><div class="kpi-delta-positive">▲ 1.4% <span class="kpi-delta-span">vs prior</span></div></div>',
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            f'<div class="kpi-container"><div class="kpi-title">Channel Split (Dine-In)</div><div class="kpi-value">69%</div><div class="kpi-delta-positive">Healthy structural split</div></div>',
            unsafe_allow_html=True,
        )
    with col3:
        st.markdown(
            f'<div class="kpi-container"><div class="kpi-title">Avg Order Value</div><div class="kpi-value">$162.0</div><div class="kpi-delta-positive">▲ 0.6% <span class="kpi-delta-span">vs prior</span></div></div>',
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown('<div class="section-card"><strong>Average Daily Sales / Outlet Trend</strong>', unsafe_allow_html=True)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    vals = [12.2, 9.5, 9.1, 10.7, 12.5, 11.3]

    fig_area = go.Figure()
    fig_area.add_trace(
        go.Scatter(
            x=months,
            y=vals,
            mode="lines+markers",
            line=dict(color=THEME_PRIMARY, width=3),
            fill="tozeroy",
            fillcolor="rgba(17, 75, 62, 0.08)",
        )
    )
    fig_area.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        height=350,
        margin=dict(t=20, b=20, l=10, r=10),
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor="#E2E8F0"),
    )
    st.plotly_chart(fig_area, use_container_width=True, config={"displayModeBar": False})
    st.markdown("</div>", unsafe_allow_html=True)
