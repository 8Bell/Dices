import * as React from 'react';
import './dice.scss';
import { defaultFaceGrid, faceClasses, faceTransformMap, times, valueClassMap } from './_utils';

const { useState, useEffect, forwardRef, useImperativeHandle } = React;

const getFaceArray = (size, faces, faceBg) => {
	return faceClasses.map((className, index) => ({
		className,
		children: !faces[index] ? (
			<div className={`defaultFace ${valueClassMap[index + 1]}`}>
				{times(25, (idx) => (
					<div key={idx}>
						{defaultFaceGrid[index + 1].includes(idx) && <span />}
					</div>
				))}
			</div>
		) : null,
		style: {
			...faceTransformMap[index + 1](size / 2),
			width: size + 'px',
			height: size + 'px',
			...(faceBg && { backgroundColor: faceBg }),
			...(faces[index] && { backgroundImage: `url(${faces[index]})` }),
		},
	}));
};

const ReactDice = forwardRef((props, ref) => {
	const {
		rollingTime = 1000,
		onRoll,
		defaultValue = 6,
		size = 250,
		faceBg,
		faces = [],
		disabled,
		cheatValue,
		placement,
		sound,
		triggers = ['click'],
		...rest
	} = props;
	const [value, setValue] = useState(defaultValue);
	const [rolling, setRolling] = useState(false);
	const [faceArray, setFaceArray] = useState([]);
	const [placementStyles, setPlacementStyles] = useState({});
	const [buttonStyles, setButtonStyles] = useState({});

	const handleDiceRoll = (value) => {
		let diceAudio;
		if (sound) {
			diceAudio = new Audio(sound);
			diceAudio.play();
		}
		setRolling(true);
		setTimeout(() => {
			let rollValue = Math.floor(Math.random() * 6 + 1);

			if (value) rollValue = value;
			if (cheatValue) rollValue = cheatValue;

			setRolling(false);
			setValue(rollValue);

			if (diceAudio) diceAudio.pause();
			if (!onRoll) return;
			onRoll(rollValue);
		}, rollingTime);
	};

	useImperativeHandle(ref, () => ({ rollDice: handleDiceRoll }));

	const keyPressHandler = (event) => {
		if (!triggers?.length || !triggers.includes(event.key)) {
			return;
		}

		handleDiceRoll();
	};

	const clickHandler = () => {
		if (!triggers?.length || !triggers.includes('click')) {
			return;
		}

		handleDiceRoll();
	};

	useEffect(() => {
		if (typeof window === 'undefined' || !triggers?.length) {
			return;
		}
		window.addEventListener('keypress', keyPressHandler);
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener('keypress', keyPressHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggers]);

	useEffect(() => {
		setFaceArray(getFaceArray(size, faces, faceBg));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [size, faces.length, faceBg]);

	useEffect(() => {
		const positionStyles = placement?.split('-')?.reduce((acc, curr) => {
			return { ...acc, [curr]: ['left', 'right'].includes(curr) ? 0 : `-${size}px` };
		}, {});
		setPlacementStyles(positionStyles);
	}, [placement, size]);

	useEffect(() => {
		setButtonStyles({
			...rest,
			...placementStyles,
			width: size + 'px',
			height: size + 'px',
			filter: disabled ? 'grayscale(100%)' : 'unset',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [placementStyles, size, disabled]);

	if (!faceArray?.length) return null;

	return (
		<button
			disabled={disabled || rolling}
			onClick={clickHandler}
			style={buttonStyles}
			className={`_space3d ${valueClassMap[value]} ${rolling && 'rolling'}`}>
			<div className='_3dbox'>
				<div {...faceArray[0]} />
				<div {...faceArray[1]} />
				<div {...faceArray[2]} />
				<div {...faceArray[3]} />
				<div {...faceArray[4]} />
				<div {...faceArray[5]} />
			</div>
		</button>
	);
});

export default ReactDice;
