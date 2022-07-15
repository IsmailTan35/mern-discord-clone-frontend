import React from 'react';

const First = ({setStep}) => {
	return (
		<>
			<div style={{minWidth:"100%"}}>
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
									<img src="/assets/img/createserver/createserver-1.svg" alt=""/>
								</div>
								<div onClick={()=>{setStep(1)}}>
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
								<img src="/assets/img/createserver/createserver-2.svg" alt=""/>

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
								<img src="/assets/img/createserver/createserver-3.svg" alt=""/>

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
								<img src="/assets/img/createserver/createserver-4.svg" alt=""/>

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
								<img src="/assets/img/createserver/createserver-5.svg" alt=""/>

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
								<img src="/assets/img/createserver/createserver-6.svg" alt=""/>

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
								<img src="/assets/img/createserver/createserver-7.svg" alt=""/>

								</div>
								<div>
									Yerel Topluluklar
								</div>
								<div>
								</div>
							</div>
						</button>

					</div>
					
					<div className='modal-secondRow' style={{background:"#f2f3f5"}}>
						<div className='modal-secondRow-header'>
							<h3>
								Zaten davetin var mı?
							</h3>
						</div>
						<div className='modal-secondRow-button-wrapper'>
							<button className='modal-secondRow-button' onClick={()=>{setStep(1)}}>
								Bir Sunucuya Katıl
							</button>
						</div>
					</div>
				</div>
		</>
	);
};

export default First;