import { SocketContext } from "controller/Context";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as BlockedFriend } from "assets/img/blockedFriend.svg";

const Blocked = () => {
  const socket = useContext(SocketContext);

  const friendsBlocked = useSelector(state => state.friends.blocked);
  useEffect(() => {
    socket.emit("getFriendBlockeds");
  }, []);
  return (
    <>
      {friendsBlocked && friendsBlocked.length > 0 ? (
        <>
          <div className="friends-online-text-wrapper">
            {`${"Engellenen Kullanıcılar- "}${
              friendsBlocked.length > 0 ? friendsBlocked.length : ""
            }`}
          </div>
          {friendsBlocked.map((friend, index) => {
            return (
              <div
                className="friends-users-list-item-wrapper"
                key={index}
                onClick={() => {}}
              >
                <div className="friends-users-list-item">
                  <div className="friends-users-list-item-avatar">
                    <svg
                      aria-hidden="false"
                      width="28"
                      height="20"
                      viewBox="0 0 28 20"
                    >
                      <path
                        fill="white"
                        d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"
                      ></path>
                    </svg>
                    <div className="friends-users-list-item-state"></div>
                  </div>
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
                    {friend.type === "incoming" ? (
                      <>
                        <div
                          onClick={() => {
                            handleAccept(friend);
                          }}
                        >
                          <svg viewBox="0 0 20 20" fill="none">
                            <path
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
                            ></path>
                            <path
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
                            ></path>
                          </svg>
                        </div>
                        <div
                          onClick={() => {
                            handleReject(friend);
                          }}
                        >
                          <svg viewBox="0 0 20 20" fill="none">
                            <path
                              width={25}
                              height={25}
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
                            ></path>
                            <path
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
                            ></path>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={() => {
                            handleCancel(friend);
                          }}
                        >
                          <svg viewBox="0 0 20 20" fill="none">
                            <path
                              width={25}
                              height={25}
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
                            ></path>
                            <path
                              fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                              d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
                            ></path>
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div style={{ display: "flex", flex: "1 1" }}>
          <div
            className="friends-add-image"
            style={{ flexDirection: "column", rowGap: 30 }}
          >
            <BlockedFriend />
            <div style={{ color: "#72767D" }}>
              {`Wumpus'un engelini kaldırmazsın.`}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blocked;
