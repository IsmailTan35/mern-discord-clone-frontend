import React, { useLayoutEffect, useRef, useState } from 'react';
import "assets/css/modal.css";
import First from './First';
import Second from './Second';
import Third from './Third';
import { useEffect } from 'react';

const AddServerModal = ({show,setShow}) => {
	const [step,setStep] = useState(0);
	const [type,setType] = useState("create");
	const ref= useRef(null);
	const [modalHeight,setModalHeight] = useState("auto");

	useEffect(()=>{
		if(!show) setStep(0)
	},[show])

	useLayoutEffect(()=>{
		
		if(!ref || ref.current.children[step].getBoundingClientRect().height<=0) return
		setModalHeight(ref.current.children[step].getBoundingClientRect().height)

		return ()=>{
			setModalHeight(ref.current.children[step].getBoundingClientRect().height)
		}
	},[ref,step])

	useEffect(()=>{
		if(!ref) return 
		ref.current.addEventListener("click",(e)=>{
			if(e.target.className==="modal-close-icon") setShow(false)
		})
	},[ref])
	return (
		<>
			<div className='modal-container' >
				<div className={`modal-wrapper${show?" active":""}`} onClick={setShow}/>
				<div className={`mymodal${show?" active":""}`} >
					<div ref={ref} 
						style={{background:"white",display:"flex",transform:`translate(${step*-100}%,0)`,transition:"all .3s ease-in-out",maxHeight:modalHeight,alignItems:"center"}}>
						<First setStep={setStep} setType={setType}/>
						<Second setStep={setStep} type={type} />
						<Third setStep={setStep} setShow={setShow}/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddServerModal;