import { useContext, useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "controller/Context";
import AvatarPicture from "components/AvatarPicture";
import { ReactComponent as AllFriend } from "assets/img/allFriend.svg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const delay = { show: 50, hide: 0 };

const All = () => {
  const friends = useSelector(state => state.friends.all);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("getFriendAll");
  }, []);

  const openChat = (e, data) => {
    e.preventDefault();
    if (!data) return;
    navigate(`/channels/@me/${data._id}`);
  };

  const openMore = (e, data) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUnfriend = id => {
    if (!id) return;
    socket.emit("unfriend", id);
  };

  return (
    <>
      {friends && friends.length === 0 ? (
        <div style={{ display: "flex", flex: "1 1" }}>
          <div
            className="friends-add-image"
            style={{ flexDirection: "column", rowGap: 30 }}
          >
            <AllFriend />
            <div style={{ color: "#72767D" }}>
              {`Wupsun'un hiç arkadaşı yok.`}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="friends-search-input-wrapper">
            <input placeholder="Ara"></input>
          </div>
          <div className="friends-online-text-wrapper">
            {`${"TÜM ARKADAŞLAR-"}${
              friends && friends.length > 0 ? friends.length : ""
            }`}
          </div>
          <div className="friends-users-list-wrapper">
            {friends &&
              friends.map((friend, index) => (
                <div
                  className="friends-users-list-item-wrapper"
                  key={index}
                  onClick={e => {
                    openChat(e, friend);
                  }}
                >
                  <div className="friends-users-list-item">
                    <AvatarPicture />
                    <div className="friends-users-list-item-user">
                      <div className="friends-users-list-item-user-name">
                        <div>{friend.username}</div>
                        <div className="friends-users-list-item-user-code">
                          {`#${friend.code}`}
                        </div>
                      </div>
                      <div className="friends-users-list-item-user-state">
                        {friend.state || "Çevrimiçi"}
                      </div>
                    </div>
                    <div className="friends-users-list-item-buttons">
                      <div
                        onClick={e => {
                          openChat(e, friend.userId);
                        }}
                      >
                        <svg
                          aria-hidden="false"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
                          ></path>
                        </svg>
                      </div>
                      <OverlayTrigger
                        placement="bottom"
                        delay={delay}
                        overlay={props => {
                          return (
                            <Tooltip {...props}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  padding: "10px",
                                  rowGap: "10px",
                                }}
                              >
                                <div>Görüntülü Arama Başlat</div>
                                <div>Sesli Arama Başlat</div>
                                <div style={{ color: "red" }}>
                                  Arkadaşı Çıkar
                                </div>
                              </div>
                            </Tooltip>
                          );
                        }}
                      >
                        <div onClick={openMore} className="more">
                          <svg
                            aria-hidden="false"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <g>
                              <path fill="transparent" d="M24 0v24H0V0z"></path>
                              <path
                                fill="currentColor"
                                d="M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z"
                              ></path>
                            </g>
                          </svg>
                        </div>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default All;
