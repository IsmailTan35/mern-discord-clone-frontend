import "assets/style/friends.css";
const Active = () => {
    return (
        <>
        <div className="friends-nowplaying-wrapper">
            <div className="dashboard-panel-nowplaying-header">
                {`Şimdi Aktif`}
            </div>
            <div className="friends-active-body-text-wrapper">
                <div className="friends-active-body-firstText">{`Burası şimdilik sessiz...`}</div>
                <div className="friends-active-body-secondText">{`Bir arkadaşın, bir oyun oynamak veya sesli sohbete katılmak gibi bir etkinliğe başladığında burada göstereceğiz!`}</div>
            </div>
        </div>
        </>
    )
}

export default Active