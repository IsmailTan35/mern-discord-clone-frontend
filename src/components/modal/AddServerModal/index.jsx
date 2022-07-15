import React, { useRef, useState } from 'react';
import "assets/style/modal.css";
import First from './First';
import Second from './Second';
import Third from './Third';
import { useEffect } from 'react';

const AddServerModal = ({show,setShow}) => {
	const [step,setStep] = useState(0);
	const ref= useRef(null);
	const [modalHeight,setModalHeight] = useState("100%");

	useEffect(()=>{
		if(!show) setStep(0)
	},[show])
	console.log(step)
	useEffect(()=>{
		if(!ref) return
		if(ref.current.children[step].getBoundingClientRect().height<=0) return

		setModalHeight(ref.current.children[step].getBoundingClientRect().height)
	},[ref,step])
	return (
		<>
			<div style={{pointerEvents:"none",position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",height:"100%",width:"100%"}}>
				<div className={`modal-wrapper${show?" active":""}`} onClick={setShow}>
				</div>
				<div 
					className={`mymodal${show?" active":""}`} 
					onClick={(e)=>{e.preventDefault();e.stopPropagation()}}
					style={{overflow:"hidden"}}
					
					>
					<div ref={ref} 
						style={{background:"white",display:"flex",transform:`translate(${step*-100}%,0)`,transition:"all .3s ease-in-out",maxHeight:modalHeight,alignItems:"center"}}>
						<First setStep={setStep}/>

						<Second setStep={setStep}/>
						<Third setStep={setStep}/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddServerModal;