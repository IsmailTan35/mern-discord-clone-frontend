import React, { useEffect, useState } from 'react';
import "assets/css/settings.css"
import { 
    IoLogoInstagram, 
    IoLogoTwitter,
    IoLogoFacebook, 
    IoCloseCircleOutline
} from "react-icons/io5";
import Nitro from "assets/img/nitro.svg";
import { RiLoginBoxFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from 'store';

const ESCAPE_KEYS = ['27', 'Escape'];

const Settings = ({data,setData}) => {
    const [selected, setSelected] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(userActions.delete())
        navigate("/auth/login");
    }
    const header = [
    { head: 'Kullanıcı Ayarları', items: [
        { key: 1, value: 'Hesabım' },
        { key: 2, value: 'Kullanıcı Profili' },
        { key: 3, value: 'Gizlilik ve Güvenlik' },
        { key: 4, value: 'Bağlantılar' },
    ] },
    { head: 'Faturalandırma Ayarları', items: [
        { key: 5, value: 'Discord Nitro' ,icon: <img src={Nitro} alt='discord'/>},
        { key: 6, value: 'Sunucu Takviyesi' },
        { key: 7, value: 'Abonelik' },
        { key: 8, value: 'Hediye Envanteri' },
        { key: 9, value: 'Faturalandırma' },
    ] },
    { head: 'Uygulama Ayarları', items: [
        { key: 10, value: 'Görünüm' },
        { key: 11, value: 'Erişebilirlik' },
        { key: 12, value: 'Ses ve Görüntü' },
        { key: 13, value: 'Metin ve Resimler' },
        { key: 14, value: 'Bildirimler' },
        { key: 15, value: 'Tuş Atamaları' },
        { key: 16, value: 'Dil' },
        { key: 17, value: 'Yayıncı Modu' },
        { key: 18, value: 'Gelişmiş' },
    ] },
    { head: 'Etkinlik Ayarları', items: [
        { key: 19, value: 'Etkinlik Durumu' },
    ] },
    { head: null, items: [
        { key: 20, value: 'Değişim Kaydı' },
        { key: 22, value: 'HypeSquad' },
    ] },
    { head: null, items: [
        { key: 23, value: 'Çıkış yap' , icon: <RiLoginBoxFill style={{borderRadius:50}}/>,click:handleLogout},
    ] },
]
    const handleClick = (key) => {
        setSelected(key)
    }
    
    useEffect(() => {
        if(!data) return
        function handler({ key }){
            if (ESCAPE_KEYS.includes(String(key))) {
                setData()
            }
          }
        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
        }
    }, [data])

    return (
        <>
            <div className={`settings-out${data?"-active":""}`}>
                <div className={`settings-wrapper${data?"-active":""}`}>
                    <div className="settings-primary-wrapper">
                        <div className="settings-primary">
                            {header.map((item, index) => (
                                <div key={index}>
                                <div className="settings-primary-item" >
                                    {item.head && <div className="settings-primary-item-head">
                                        {item.head}
                                    </div>}
                                    <div className="settings-primary-item-items">
                                        {item.items.map((i, index2) => (
                                            <div className={`settings-primary-item-item${selected===i.key?"-active":""}`} 
                                                key={index2} 
                                                onClick={()=>{i.click ? i.click() : handleClick(i.key)}}>
                                                <div className="settings-primary-item-item-value">
                                                    {i.value}
                                                </div>
                                                <div className="settings-primary-item-item-icon">
                                                    {i.icon}
                                                </div>
                                            </div>
                                        )
                                        )}
                                    </div>
                                </div>
                                <div className='settings-divider'/>
                                </div>
                            )
                            )}
                            <div className='settings-social'>
                                <IoLogoTwitter className='settings-social-icon'/>
                                <IoLogoFacebook className='settings-social-icon'/>
                                <IoLogoInstagram className='settings-social-icon'/>

                            </div>
                            <div >
                                <div style={{marginBottom:10}}>Stable 126963 (8500d26)</div>
                                <div >Windows 10 64-Bit</div>
                            </div>
                        </div>
                    </div>
                    <div className="settings-secondary-wrapper">
                        <div className="settings-secondary">
                        </div>
                        <div className='settings-close-button'>
                            <IoCloseCircleOutline className='settings-close-icon' onClick={setData}/>
                            <div>ESC</div>
                        </div>
                                            
                    </div>
                </div>
            </div>
        </>
    );
};



export default Settings;