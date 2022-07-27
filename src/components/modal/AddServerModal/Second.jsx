import React from 'react';
import CreateServer from './CreateServer';
import JoinServer from './JoinServer';
import { ReactComponent as CloseIcon } from 'assets/img/closeIcon.svg';

const Second = ({setStep,type}) => {

	const handleBack = () => {
		setStep(step=>step-1);
	}

	const handleNext = () => {
		setStep(step=>step+1);
	}
	
	return (
		<>
			<div style={{minWidth:"100%",position:"relative"}}>
				<div className='modal-close-icon'>
					<CloseIcon style={{pointerEvents:"none"}} />
				</div>
				{type==="create"?<CreateServer setStep={setStep}/>:<JoinServer setStep={setStep}/>}
			</div>
		</>
	);
};

export default Second;