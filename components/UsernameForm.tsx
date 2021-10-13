import { useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useState, useCallback } from 'react';
import { useUserData } from '../lib/hooks';
import { firestore } from '../lib/firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';

const UserNameForm = () => {
	const { user, username } = useUserData();
	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const onChange = (e: any) => {
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username.length >= 3) {
				const usernameRef = doc(firestore, 'usernames', username);
				const docSnap = await getDoc(usernameRef);
				setIsValid(!docSnap.exists());
				setLoading(false);
			}
		}, 500),
		[]
	);

	const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const userDoc = doc(firestore, 'users', user.uid);
		const usernameDoc = doc(firestore, 'usernames', formValue);
		const batch = writeBatch(firestore);
		batch.set(userDoc, {
			username: formValue,
			displayName: user.displayName,
			email: user.email,
			uid: user.uid,
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	};
	return (
		<>
			<pre>USER: {JSON.stringify(user, null, 2)}</pre>
			<pre>USERNAME: {JSON.stringify(username, null, 2)}</pre>
			{!username && (
				<section>
					<h3>Choose Username</h3>
					<form onSubmit={onSubmit}>
						<input name='username' placeholder='myname' value={formValue} onChange={onChange} />
						<UsernameMessage username={formValue} isValid={isValid} loading={loading} />
						<button type='submit' disabled={!isValid}>
							Choose
						</button>

						<h3>Debug State</h3>
						<div>
							user: {user && user.uid}
							<br />
							Username: {formValue}
							<br />
							Loading: {loading.toString()}
							<br />
							Username Valid: {isValid.toString()}
						</div>
					</form>
				</section>
			)}
		</>
	);
};

export default UserNameForm;

function UsernameMessage({ username, isValid, loading }: any) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p>{username} is available!</p>;
	} else if (username && !isValid) {
		return <p>That username is taken!</p>;
	} else {
		return <p></p>;
	}
}
