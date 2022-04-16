import "assets/style/friends.css";
const Add = () => {
    return (
        <div>
            <div className="friends-add-header">{`Arkadaş Ekle`}</div>
            <div className="friends-add-subheader">{`Bir arkadaşını Discord Etiketi ile ekleyebilirsin. BüYüK kÜçÜk HaRfLeRe DuYaRlIdIr!`}</div>
            <div className="friends-add-input-wrapper">
                <input className="friends-add-input" type="text" placeholder="Bir kullanıcı adı#0000 gir" />
                <button className="friends-add-input-button" disabled>{`Arkadaşlık isteği gönder`}</button>
            </div>
            <div>
                <div className="friends-add-image"/>
            </div>
        </div>
    )
}

export default Add