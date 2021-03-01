import React from 'react';
import 'antd/dist/antd.css';
import { Card } from 'antd';
import { Button, Dropdown, Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import {
  setEdit,
  deleteProgram,
  currentProgram,
} from '../../state/actions/programActions';
import { setCourseList } from '../../state/actions/courseActions';

export default function ProgramCard(props) {
  const { program } = props;
  const dispatch = useDispatch();
  const { push } = useHistory();

  const handleMenuClick = e => {
    if (e.key === 'edit') {
      dispatch(setEdit(program));
      push('/edit-program');
    } else {
      console.log(program);
      axiosWithAuth()
        .delete(
          `https://reach-team-a-be.herokuapp.com/programs/program/${program.programid}`
        )
        .then(res => {
          console.log(program.programid);
          dispatch(deleteProgram(program.programid));
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" extra="">
        Edit Program
      </Menu.Item>
      <Menu.Item key="delete">Delete Program</Menu.Item>
    </Menu>
  );

  const viewProgramHandler = program => {
    axiosWithAuth()
      .get(`https://reach-team-a-be.herokuapp.com/courses/${program.programid}`)
      .then(res => {
        console.log(res);
        dispatch(setCourseList(res.data));
        dispatch(currentProgram(program));
      })
      .catch(err => console.log(err));
    push('/courses');
  };

  return (
    <>
      <Card
        title={program.programname}
        extra={<Dropdown.Button overlay={menu}></Dropdown.Button>}
        style={{ width: 800, margin: '3% 0' }}
        className="program-card"
      >
        <h3>{program.programtype}</h3>
        <p>{program.programdescription}</p>
        <Button onClick={() => viewProgramHandler(program)} type="primary">
          View Program
        </Button>
      </Card>
    </>
  );
}
