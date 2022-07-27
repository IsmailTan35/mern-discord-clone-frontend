import React from 'react';
import { ReactComponent as ArrowIcon } from 'assets/img/arrowIcon.svg';
import { ReactComponent as CloseIcon } from 'assets/img/closeIcon.svg';

const First = ({setStep,setType}) => {
	return (
		<>
			<div style={{minWidth:"100%",position:"relative"}}>
					<div className='modal-close-icon'>
						<CloseIcon  style={{pointerEvents:"none"}}/>
					</div>
					<div className='modal-firstRow'>
						<div className='mymodal-header'>
							<h3>
								Bir sunucu oluştur.
							</h3>
						</div>
						<div className='modal-subheader'>
							Sunucun, arkadaşlarınla takıldığınız yerdir. Kendi sunucunu oluştur ve konuşmaya başla.
						</div>
					</div>
					<div className='modal-create-buttons'>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
									<img src="/assets/img/createserver/createserver-1.svg" alt=""/>
								</div>
								<div className='modal-create-button-content-text'>
									Kendim Oluşturayım
								</div>
								<div className="modal-create-button-icon">
									<ArrowIcon/>
								</div>
							</div>
						</button>
						<span> BİR SABLON KULLANARAK BAŞLA</span>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
									<img src="/assets/img/createserver/createserver-2.svg" alt=""/>
								</div>
								<div className='modal-create-button-content-text'>
									Oyun
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
								<img src="/assets/img/createserver/createserver-3.svg" alt=""/>

								</div>
								<div className='modal-create-button-content-text'>
									Okul Kulübü
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
								<img src="/assets/img/createserver/createserver-4.svg" alt=""/>

								</div>
								<div className='modal-create-button-content-text'>
									Çalışma Grubu
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
								<img src="/assets/img/createserver/createserver-5.svg" alt=""/>

								</div>
								<div className='modal-create-button-content-text'>
									Arkadaşlar
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
									<img src="/assets/img/createserver/createserver-6.svg" alt=""/>
								</div>
								<div className='modal-create-button-content-text'>
									Sanatçılar ve Zanatkârlar
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={()=>{setStep(1);setType("create")}}>
							<div className='modal-create-button-content'>
								<div>
								<img src="/assets/img/createserver/createserver-7.svg" alt=""/>

								</div>
								<div className='modal-create-button-content-text'>
									Yerel Topluluklar
								</div>
								<div className="modal-create-button-icon">
								<ArrowIcon/>

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
							<button className='modal-secondRow-button' onClick={()=>{setStep(1);setType("join")}}>
								Bir Sunucuya Katıl
							</button>
						</div>
					</div>
				</div>
		</>
	);
};

export default First;