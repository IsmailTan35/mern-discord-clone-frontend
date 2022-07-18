import axios from 'axios';
import React from 'react';

const Third = ({setStep}) => {

	const handleBack = (e) => {
		e.preventDefault();
		setStep(step=>step-1);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(e.target.serverName.value);
		axios.post('/api/server',{
			serverName:e.target.serverName.value
		}).then(res => {
			console.log(res);
		}
		).catch(err => {
			console.log(err);
		}
		)
	}
	
	const handleChange = (e) => {
		e.preventDefault();
		console.log(e.target.value);
	}

	return (
		<>
			<div style={{minWidth:"100%"}}>
				<form onSubmit={handleSubmit}>

				<div className='modal-firstRow'>
					<div className='mymodal-header'>
						<div>
							Sunucunu özelleştir
						</div>
					</div>
					<div className='modal-subheader'>
						Yeni sunucuna bir isim ve simge ekleyerek ona kişilik kat. Bunları istediğin zaman değişirebilirsin.
					</div>
				</div>
				<div className='modal-upload-button-wrapper'>
					<img src="/assets/img/upload.svg" alt="" style={{position:"absolute"}}/>
					<input 
						type="file" 
						className='modal-upload-button'

						style={{position:"absolute"}}/>
				</div>
				<div className="modal-input-wrapper">
					<h5 className='modal-input-label'>Sunucu Adı</h5>
					<div>
						<input 
							name='serverName'
							type="text" 
							placeholder="Sunucu Adı" 
							className="modal-input"
							onChange={handleChange}
							/>
					</div>
				</div>
				<div className='modal-term'>
					Bir sunucu oluşturark, Discord'un Topluluk İlkelerini kabul etmiş olursun.
				</div>
				<div className='modal-secondRow' 
					style={{background:"#f2f3f5",display:"flex",justifyContent:"space-between"}}>
					<button className="modal-back-button" onClick={handleBack}>
						Geri
					</button>
					<button type="submit" 
						className='modal-secondRow-button' 
						style={{background:"rgb(88,101,242)",width:"auto"}} >
						Oluştur
					</button>

				</div>
				</form>
			</div>
		</>
	);
};

export default Third;