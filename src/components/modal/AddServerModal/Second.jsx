import React from 'react';

const Second = ({setStep}) => {

	const handleBack = () => {
		setStep(step=>step-1);
	}

	return (
		<>
			<div style={{minWidth:"100%"}}>
				<div className='modal-firstRow'>
					<div className='mymodal-header'>
						<h3>
							Bize sunucundan biraz bahset
						</h3>
					</div>
					<div className='modal-subheader'>
						Kuruluma yardımcı olmak isityoruz. Sunucun birkaç arkadaş için mi yoksa daha büyük bir topluluk için mi?
					</div>
				</div>
				<div className='modal-create-buttons'>
					<div>
						<div></div>
						<div>Bir kulüp veya topluluk için</div>
						<div></div>
					</div>
					<div>Benim ve arkadaşlarım için</div>
					<div>
						Emin değil misin? Şimdilik bu soruyu geçebilirsin.
					</div>
				</div>
				<div className='modal-secondRow' style={{background:"#f2f3f5"}}>
					<button onClick={handleBack}>
						Geri
					</button>
				</div>

			</div>
		</>
	);
};

export default Second;