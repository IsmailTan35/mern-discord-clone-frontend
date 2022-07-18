import React from 'react';

const Second = ({setStep}) => {

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
							Bize sunucundan biraz bahset
						</div>
					</div>
					<div className='modal-subheader'>
						Kuruluma yardımcı olmak isityoruz. Sunucun birkaç arkadaş için mi yoksa daha büyük bir topluluk için mi?
					</div>
				</div>
				<div className='modal-create-buttons' style={{height:"auto"}}>
					<button className='modal-create-button' onClick={handleNext}>
						<div></div>
						<div>Bir kulüp veya topluluk için</div>
						<div></div>
					</button>
					<button className='modal-create-button'>
						Benim ve arkadaşlarım için
					</button>
					<div>
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

export default Second;