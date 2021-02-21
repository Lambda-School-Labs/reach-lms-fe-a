import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import schema from '../../validation/Schema';
import { editUser } from '../../state/actions/userActions';

const initialFormErrors = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
};

export default function EditUserForm() {
  const userToEdit = useSelector(state => state.userReducer.edit_user);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const user = useSelector(state => state.userReducer);
  const [input, setInput] = useState({
    fname: user.fname,
    lname: user.lname,
    phone: user.phone,
    email: user.email[0].useremail,
    role: user.role,
  });
  const [errors, setErrors] = useState(initialFormErrors);

  if (!user.role) {
    push('/');
  }

  function changeHandler(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function editUserSubmit(e) {
    e.preventDefault();
    // console.log(values);

    function validate() {
      schema
        .validate(input, { abortEarly: false })
        .then(res => {
          console.log(res);
          axiosWithAuth()
            .patch(
              `https://reach-team-a-be.herokuapp.com/users/user/${user.id}`,
              input
            )
            .then(res => console.log(res))
            .catch(err => console.log(err));
          dispatch(editUser(input));
          push('/profile');
        })
        .catch(err => {
          console.log(err);
          const emptyErr = {
            fname: '',
            lname: '',
            email: '',
            phone: '',
          };
          err.inner.forEach(element => {
            emptyErr[element.path] = element.message;
          });
          setErrors(emptyErr);
        });
    }

    validate();
  }

  return (
    <div className="container">
      <h1>Edit User</h1>
      <form onSubmit={editUserSubmit}>
        <label htmlFor="fname">
          First Name:
          <input
            type="text"
            id="fname"
            name="fname"
            value={input.fname}
            onChange={changeHandler}
          />
        </label>
        <div>{errors.fname ? `${errors.fname}` : ''}</div>

        <label htmlFor="lname">
          Last Name:
          <input
            type="text"
            id="lname"
            name="lname"
            value={input.lname}
            onChange={changeHandler}
          />
        </label>
        <div>{errors.lname ? `${errors.lname}` : ''}</div>

        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
          />
        </label>
        <div>{errors.email ? `${errors.email}` : ''}</div>

        <label htmlFor="phone">
          Phone Number:
          <input
            type="text"
            id="phone"
            name="phone"
            value={input.phone}
            onChange={changeHandler}
          />
        </label>
        <div>{errors.phone ? `${errors.phone}` : ''}</div>

        <button>Submit</button>
      </form>
    </div>
  );
}
