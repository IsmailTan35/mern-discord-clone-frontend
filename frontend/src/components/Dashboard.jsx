import "assets/style/dashboard.css"
const Dashboard =()=>{
    return(
        <>
        <div className="dashboard-wrapper">
                <div className="dashboard-second-wrapper">
                    <div className="dashboard-sidebar">
                        <nav className="dashboard-side-navbar">

                        <div className="dashboard-sidebar-search-button-wrapper">
                            <button className="dashboard-sidebar-search-button">
                                {"Sohbet bul ya da başlat"}
                            </button>
                        </div>
                        </nav>
                            <div style={{height:"8px",width:"100%"}}></div>
                            <div className="dashnoard-sidebar-chat-wrapper">
                                <div className="dashboard-sidebar-chat-buttons-wrapper">
                                    <div className="dashboard-sidebar-chat-button">
                                        <svg class="linkButtonIcon-Mlm5d6" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24">
                                            <g fill="none" fill-rule="evenodd"><path fill="currentColor" fill-rule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g>
                                        </svg>
                                        {`Arkadaşlar`}
                                        </div>
                                    <div className="dashboard-sidebar-chat-button">
                                        <svg class="linkButtonIcon-Mlm5d6" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M2.98966977,9.35789159 C2.98966977,9.77582472 2.63442946,10.1240466 2.20807287,10.1240466 L1.78171628,10.1240466 C1.35535969,10.1240466 0.999948837,9.77582472 0.999948837,9.35789159 C0.999948837,8.93995846 1.35535969,8.59173658 1.78171628,8.59173658 L2.20807287,8.59173658 C2.63442946,8.59173658 2.98966977,8.93995846 2.98966977,9.35789159 Z M22.2467643,9.14892503 C24.0942527,12.9800344 22.3888264,17.5772989 18.3384388,19.3882867 C14.4302837,21.1297305 9.74036124,19.457998 7.9638186,15.6268886 C7.60857829,14.8607335 7.3954,14.0248673 7.32428372,13.189001 L5.76091938,13.189001 C5.33456279,13.189001 4.97932248,12.840612 4.97932248,12.4226788 C4.97932248,12.0047457 5.33456279,11.6565238 5.76091938,11.6565238 L8.03493488,11.6565238 C8.46129147,11.6565238 8.81653178,11.3083019 8.81653178,10.8903688 C8.81653178,10.4724357 8.46129147,10.1240466 8.03493488,10.1240466 L4.41090388,10.1240466 C3.98454729,10.1240466 3.62913643,9.77582472 3.62913643,9.35789159 C3.62913643,8.93995846 3.98454729,8.59173658 4.41090388,8.59173658 L9.45606667,8.59173658 C9.88242326,8.59173658 10.2376636,8.24334752 10.2376636,7.82541439 C10.2376636,7.40748126 9.88242326,7.05925937 9.45606667,7.05925937 L7.3954,7.05925937 C6.75586512,7.05925937 6.18727597,6.57161499 6.18727597,5.87517123 C6.18727597,5.24827153 6.68474884,4.69091591 7.3954,4.69091591 L15.4250589,4.69091591 C18.267493,4.8303384 20.9676946,6.43235968 22.2467643,9.14892503 Z M13.2662961,8.38056332 C11.0193969,9.3919615 10.0341721,11.9973566 11.065955,14.1998642 C12.097738,16.4023718 14.755645,17.3681317 17.0025442,16.3567335 C19.249614,15.3453354 20.2346682,12.7399402 19.2028853,10.5374326 C18.1711023,8.33492503 15.5131953,7.36916515 13.2662961,8.38056332 Z M16.8462589,9.84548582 L18.2673907,12.2138293 C18.338507,12.3530846 18.338507,12.4227958 18.2673907,12.5620512 L16.8462589,14.9303946 C16.7751426,15.0696499 16.6330806,15.0696499 16.5619643,15.0696499 L13.7906465,15.0696499 C13.6485845,15.0696499 13.5774682,14.9999387 13.5065225,14.9303946 L12.0852202,12.5620512 C12.0142744,12.4227958 12.0142744,12.3530846 12.0852202,12.2138293 L13.5065225,9.84548582 C13.5774682,9.7062305 13.7197008,9.7062305 13.7906465,9.7062305 L16.5619643,9.7062305 C16.7041969,9.63651925 16.7751426,9.7062305 16.8462589,9.84548582 Z"></path>
                                        </svg>
                                        {`Nitro`}
                                        </div>
                                </div>
                                <div className="dashboard-sidebar-chat-header-wrapper">
                                    <div className="dashboard-sidebar-chat-header">
                                        {`DİREKT MESAJLAR`}
                                    </div>
                                    <svg x="0" y="0" class="privateChannelRecipientsInviteButtonIcon-3A3uTc icon-22AiRD" aria-hidden="false" width="24" height="24" viewBox="0 0 18 18">
                                        <polygon fill-rule="nonzero" fill="currentColor" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon>
                                    </svg>
                                </div>
                                <div className="dashboard-sidebar-chat">

                                <svg width="184" height="428" viewBox="0 0 184 428" fill="red">
                                    <rect x="40" y="6" width="144" height="20" rx="10"></rect>
                                    <circle cx="16" cy="16"  r="16" opacity="1.0"></circle><rect x="40" y="50"  width="144" height="20" rx="10" opacity="0.9"></rect>
                                    <circle cx="16" cy="60"  r="16" opacity="0.9"></circle><rect x="40" y="94"  width="144" height="20" rx="10" opacity="0.8"></rect>
                                    <circle cx="16" cy="104" r="16" opacity="0.8"></circle><rect x="40" y="138" width="144" height="20" rx="10" opacity="0.7"></rect>
                                    <circle cx="16" cy="148" r="16" opacity="0.7"></circle><rect x="40" y="182" width="144" height="20" rx="10" opacity="0.6"></rect>
                                    <circle cx="16" cy="192" r="16" opacity="0.6"></circle><rect x="40" y="226" width="144" height="20" rx="10" opacity="0.5"></rect>
                                    <circle cx="16" cy="236" r="16" opacity="0.5"></circle><rect x="40" y="270" width="144" height="20" rx="10" opacity="0.4"></rect>
                                    <circle cx="16" cy="280" r="16" opacity="0.4"></circle><rect x="40" y="314" width="144" height="20" rx="10" opacity="0.3"></rect>
                                    <circle cx="16" cy="324" r="16" opacity="0.3"></circle><rect x="40" y="358" width="144" height="20" rx="10" opacity="0.2"></rect>
                                    <circle cx="16" cy="368" r="16" opacity="0.2"></circle><rect x="40" y="402" width="144" height="20" rx="10" opacity="0.1"></rect>
                                    <circle cx="16" cy="412" r="16" opacity="0.1"></circle>
                                </svg>
                                </div>
                            </div>
                            <section className="dashboard-sidebar-section-wrapper">
                                    <div className="dashboard-sidebar-section-avatar">
                                        <svg aria-hidden="false" width="28" height="20" viewBox="0 0 28 20">
                                            <path fill="white" d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"></path>
                                        </svg>
                                        <div className="dashboard-sidebar-section-avatar-state">
                                        </div>
                                    </div>
                                    <div className="dashboard-sidebar-section-user">
                                    <div className="dashboard-sidebar-section-user-name">
                                        {"İsmail Tan"}
                                        </div>
                                    <div className="dashboard-sidebar-section-user-code">
                                        {"#1234"}
                                    </div>

                                    </div>
                                    <div className="dashboard-sidebar-section-buttons">
                                        <button>
                                            <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" fill="currentColor"></path><path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" fill="currentColor"></path><path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" fill="currentColor"></path><path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" class="strikethrough-1n4ekb" fill="currentColor"></path></svg>
                                        </button>
                                        <button>
                                        <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z" fill="currentColor"></path></svg></svg>
                                        </button>
                                        <button>
                                        <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>
                                        </button>

                                    </div>
                            </section>
                    </div>
                    <div className="dashboard-panel">
                        <div className="dashboard-panel-header-wrapper">
                            <div className="dashboard-panel-header-left">
                                <svg x="0" y="0" class="icon-22AiRD" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" fill-rule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
                                <span> {"Arkadaşlar"}</span>
                            </div>
                            <div className="dashboard-panel-header-line"></div>
                            <div className="dashboard-panel-header-text">Çevrimiçi</div>
                            <div className="dashboard-panel-header-text">Tümü</div>
                            <div className="dashboard-panel-header-text">Bekleyen</div>
                            <div className="dashboard-panel-header-text">Engellenen</div>
                            <div className="dashboard-panel-header-button">Arkadaş Ekle</div>
                            <div className="dashboard-panel-header-absolute-button">
                                <div>
                                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.998 0V3H23.998V5H20.998V8H18.998V5H15.998V3H18.998V0H20.998ZM2.99805 20V24L8.33205 20H14.998C16.102 20 16.998 19.103 16.998 18V9C16.998 7.896 16.102 7 14.998 7H1.99805C0.894047 7 -0.00195312 7.896 -0.00195312 9V18C-0.00195312 19.103 0.894047 20 1.99805 20H2.99805Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div className="dashboard-panel-header-line"></div>
                                <div>
                                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M19 3H4.99C3.88 3 3.01 3.89 3.01 5L3 19C3 20.1 3.88 21 4.99 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 15H15C15 16.66 13.65 18 12 18C10.35 18 9 16.66 9 15H4.99V5H19V15Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div>
                                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M12 2C6.486 2 2 6.487 2 12C2 17.515 6.486 22 12 22C17.514 22 22 17.515 22 12C22 6.487 17.514 2 12 2ZM12 18.25C11.31 18.25 10.75 17.691 10.75 17C10.75 16.31 11.31 15.75 12 15.75C12.69 15.75 13.25 16.31 13.25 17C13.25 17.691 12.69 18.25 12 18.25ZM13 13.875V15H11V12H12C13.104 12 14 11.103 14 10C14 8.896 13.104 8 12 8C10.896 8 10 8.896 10 10H8C8 7.795 9.795 6 12 6C14.205 6 16 7.795 16 10C16 11.861 14.723 13.429 13 13.875Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                
                </div>

            </div>
        </>
    )
}
export default Dashboard;