import React from 'react';

const JoinServer = ({setStep}) => {

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
						<h3>Bir Sunucuya Katıl</h3>
					</div >
					<div className='modal-subheader'>
						Var olan bir sunucuya katılmak için aşağıya bir davet gir
					</div>
				</div>
				<div>
					<label>Davet Bağlantısı</label>
					<div>
						<input type='text' placeholder='https://' />
					</div>
				</div>
				<div>
					<h5>Davetler Şöyle Görünür</h5>
					<div>hTKzmak</div>
					<div>https://discord.gg/hTKzmak</div>
					<div>https://discord.gg/cool-people</div>
				</div>
				<div>
					<div>

					</div>
				</div>
				<div>
					<div>
						<button onClick={handleBack}>
							Geri
						</button>
					</div>
					<div>
						<button onClick={handleNext}>
							Sunucuya Katıl
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default JoinServer;