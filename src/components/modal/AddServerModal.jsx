import React from 'react';
import "assets/style/modal.css";
const AddServerModal = ({show,setShow}) => {
	return (
		<>
			<div style={{pointerEvents:"none",position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",height:"100%",width:"100%"}}>
				<div className={`modal-wrapper${show?" active":""}`} onClick={setShow}>
				</div>
				<div className={`mymodal${show?" active":""}`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
					<div className='modal-firstRow'>
						<div className='mymodal-header'>
							<h3>
								Bir sunucu oluştur
							</h3>
						</div>
						<div className='modal-subheader'>
							Sunucun, arkadaşlarınla takıldığınız yerdir. Kendi sunucunu oluştur ve konuşmaya başla.
						</div>
					</div>
					<div className='modal-create-buttons'>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Kendim Oluşturayım
								</div>
								<div>
								</div>
							</div>
						</button>
						<span> BİR SABLON KULLANARAK BAŞLA</span>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Oyun
								</div>
								<div style={{display:"flex",flex:"1 1"}}>
									icon
								</div>
							</div>
						</button>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Okul Kulübü
								</div>
								<div>
								</div>
							</div>
						</button>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Çalışma Grubu
								</div>
								<div>
								</div>
							</div>
						</button>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Arkadaşlar
								</div>
								<div>
								</div>
							</div>
						</button>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Sanatçılar ve Zanatkârlar
								</div>
								<div>
								</div>
							</div>
						</button>
						<button className='modal-create-button'>
							<div className='modal-create-button-content'>
								<div>
								</div>
								<div>
									Yerel Topluluklar
								</div>
								<div>
								</div>
							</div>
						</button>

					</div>
					
					<div className='modal-secondRow'>
						<div className='modal-secondRow-header'>
							<h3>
								Zaten davetin var mı?
							</h3>
						</div>
						<div className='modal-secondRow-button-wrapper'>
							<button className='modal-secondRow-button'>
								Bir Sunucuya Katıl
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddServerModal;