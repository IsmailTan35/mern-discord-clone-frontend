import "assets/style/dashboard.css"
const Dashboard =()=>{
    return(
        <>
        <div className="dashboard-wrapper">
                <div className="dashboard-second-wrapper">
                    <div className="dashboard-sidebar">
                        <nav className="dashboard-navbar">

                        <div className="dashboard-sidebar-search-button-wrapper">
                            <button className="dashboard-sidebar-search-button">
                                {"Sohbet bul ya da başlat"}
                            </button>
                        </div>
                            <div style={{height:"8px",width:"100%"}}></div>
                        </nav>
                            <section className="dashboard-sidebar-section">
                                <div className="dashboard-sidevar-section-wrapper">

                                </div>
                            </section>
                    </div>
                    <div className="dashboard-panel">

                    </div>
                
                </div>

            </div>
        </>
    )
}
export default Dashboard;