import "assets/css/friends.css";
import axios from "axios";
import { useState } from "react";
import { ReactComponent as AddFriend } from "assets/img/addFriend.svg";
const Add = () => {
  const [name, setName] = useState("demo2#6846");

  const handleAdd = e => {
    e.preventDefault();
    axios
      .post("/api/friend", {
        to: name,
        token: localStorage.getItem("accessToken"),
      })
      .then(res => {})
      .catch(err => {});
  };
  return (
    <div style={{ display: "flex", flex: "1 1", flexDirection: "column" }}>
      <div className="friends-add-header">{`Arkadaş Ekle`}</div>
      <div className="friends-add-subheader">{`Bir arkadaşını Discord Etiketi ile ekleyebilirsin. BüYüK kÜçÜk HaRfLeRe DuYaRlIdIr!`}</div>
      <div className="friends-add-input-wrapper">
        <input
          className="friends-add-input"
          type="text"
          placeholder="Bir kullanıcı adı#0000 gir"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
        <button
          className="friends-add-input-button"
          onClick={handleAdd}
        >{`Arkadaşlık isteği gönder`}</button>
      </div>
      <div style={{ display: "flex", flex: "1 1" }}>
        <div
          className="friends-add-image"
          style={{ flexDirection: "column", rowGap: 30 }}
        >
          <AddFriend />
          <div style={{ color: "#72767D" }}>
            Wumpus arkadaş bekliyor. Mecbur degilsin ama!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
