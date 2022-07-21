import React from 'react';
import { ReactComponent as ArrowIcon } from 'assets/img/arrowIcon.svg';

const CreateServer = ({setStep}) => {
	const handleBack = () => {
		setStep(step=>step-1);
	}

	const handleNext = () => {
		setStep(step=>step+1);
	}
	return (
		<>
			<div style={{minWidth:"100%"}}>
				<div className='modal-firstRow'>
					<div className='mymodal-header'>
						<div>
							Bize sunucundan biraz bahset.
						</div>
					</div>
					<div className='modal-subheader'>
						Kuruluma yardımcı olmak isityoruz. Sunucun birkaç arkadaş için mi yoksa daha büyük bir topluluk için mi?
					</div>
				</div>
				<div className='modal-create-buttons' style={{height:"auto"}}>
					<button className='modal-create-button' onClick={handleNext}>
							<div className='modal-create-button-content'>
								<div>
									<img src="/assets/img/createserver/createserver-8.svg" alt=""/>
								</div>
								<div className='modal-create-button-content-text'>
								Bir kulüp veya topluluk için
								</div>
								<div className="modal-create-button-icon">
									<ArrowIcon/>
								</div>
							</div>
						</button>
						<button className='modal-create-button' onClick={handleNext}>
							<div className='modal-create-button-content'>
								<div>
									<img src="/assets/img/createserver/createserver-9.svg" alt=""/>
								</div>
								<div className='modal-create-button-content-text'>
								Benim ve arkadaşlarım için
								</div>
								<div className="modal-create-button-icon">
									<ArrowIcon/>
								</div>
							</div>
						</button>
					<div className='modal-term'>
						Emin değil misin? Şimdilik bu soruyu geçebilirsin.
					</div>
				</div>
				<div className='modal-secondRow' style={{background:"#f2f3f5"}}>
					<button className="modal-back-button" onClick={handleBack} >
						Geri
					</button>
				</div>

			</div>
		</>
	);
};

export default CreateServer;