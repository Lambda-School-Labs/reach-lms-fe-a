// REACT & HOOKS
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useUserRole, useMountEffect } from '../../hooks';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import { courseActions, moduleActions } from '../../state/ducks';

// MISC
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { pathUtils } from '../../routes';

// MATERIAL UI
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// ANT DESIGN
import Menu from 'antd/lib/menu';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
const { SubMenu } = Menu;

const ModuleList = props => {
  let { courseId } = useParams();
  courseId = parseInt(courseId);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const moduleStatus = useSelector(state => state.moduleReducer.status);
  const modules = useSelector(state => state.moduleReducer.modulesList);
  const { status, studentsMap, teachersMap, currentCourse } = useSelector(
    state => state.courseReducer
  );
  const { userIsAdmin, userIsTeacher } = useUserRole();

  const [newStudent, setNewStudent] = useState({ studentname: '' });
  const [newTeacher, setNewTeacher] = useState({ teachername: '' });

  useEffect(() => {
    if (
      status === 'add-enrolled/success' ||
      status === 'remove-enrolled/success'
    ) {
      dispatch(courseActions.getCourseThunk(courseId));
      dispatch(courseActions.mapifyStudentTeachersPowerThunk(courseId));
    } else if (moduleStatus === 'create/success') {
      dispatch(moduleActions.getModulesByCourseIdThunk(courseId));
    }
  }, [courseId, dispatch, status, push, moduleStatus]);

  useMountEffect(() => {
    dispatch(moduleActions.getModulesByCourseIdThunk(courseId));
  });

  const changeStudentValues = e => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const changeTeacherValues = e => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleClick = e => {
    // this seems like a very weird handleClick to me... maybe just AntD being AntD?
    const moduleClicked = modules.filter(
      // eslint-disable-next-line eqeqeq
      module => module.moduleid == e.key
    )[0];
    // dispatch(moduleActions.currentModule(moduleClicked));
    push(pathUtils.makeViewProgramPath(moduleClicked));
  };

  // why do we have two functions doing almost the same thing??
  const addStudent = (e, newStudent) => {
    e.preventDefault();
    dispatch(
      courseActions.addStudentToCourseThunk(currentCourse.courseid, {
        studentname: newStudent,
      })
    );
  };

  function addStudentHandler(e) {
    e.preventDefault();
    // TODO: this needs to be refactored into an actual thunk and  completely managed in Redux
    dispatch(
      courseActions.addStudentToCourseThunk(currentCourse.courseid, newStudent)
    );
  }

  function addTeacherHandler(e) {
    e.preventDefault();
    // TODO: this needs to be refactored into an actual thunk and  completely managed in Redux
    dispatch(
      courseActions.addTeacherToCourseThunk(currentCourse.courseid, newTeacher)
    );
  }

  const deleteStudentHandler = studentId => {
    // TODO: this needs to be refactored into an actual thunk and  completely managed in Redux
    dispatch(
      courseActions.deleteStudentFromCourseThunk(
        currentCourse.courseid,
        studentId
      )
    );
  };

  const deleteTeacherHandler = teacherId => {
    // TODO: this needs to be refactored into an actual thunk and  completely managed in Redux
    dispatch(
      courseActions.deleteTeacherFromCourseThunk(
        currentCourse.courseid,
        teacherId
      )
    );
  };

  return (
    <StyledContainer>
      <HeaderDiv>
        <h1>{currentCourse.coursename}</h1>
        {(userIsAdmin() || userIsTeacher()) && (
          <Link to={pathUtils.makeCreateModulePath(courseId)}>
            <Button size="large" style={{ background: '#01fe87' }}>
              Add Module
            </Button>
          </Link>
        )}
      </HeaderDiv>
      <div>
        <Menu
          onClick={handleClick}
          style={{ width: '80%' }}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <SubMenu key="sub1" title="Modules">
            {modules.map(module => {
              return (
                <Menu.Item key={module.moduleid}>{module.modulename}</Menu.Item>
              );
            })}
          </SubMenu>
        </Menu>
      </div>
      {/* 
          {ADD TEACHER FORM and TEACHER LIST} 
          Maybe we could split some of this component out into separate components?? There's a LOT going on.
          */}

      <div>
        {userIsAdmin() && (
          <>
            <StyledForm>
              <StyledFormItem
                htmlFor="teachername"
                label="Add Teacher:"
                validateStatus
              >
                <Input
                  id="teachername"
                  name="teachername"
                  value={newTeacher.teachername}
                  onChange={changeTeacherValues}
                />
              </StyledFormItem>
              <StyledSubmit>
                <Button
                  onClick={addTeacherHandler}
                  type="primary"
                  className="button"
                >
                  Submit
                </Button>
              </StyledSubmit>
            </StyledForm>
            <div>
              <Menu
                style={{ width: '80%' }}
                defaultOpenKeys={['sub3']}
                mode="inline"
              >
                <SubMenu key="sub3" title="Teachers">
                  {teachersMap?.enrolled &&
                    Object.entries(teachersMap.enrolled).map(
                      ([teacherid, { teachername }]) => (
                        <React.Fragment key={teacherid}>
                          <StyledMenuRow>
                            <Menu.Item
                              key={teacherid}
                              style={{ marginTop: '2.5%' }}
                            >
                              {teachername}
                            </Menu.Item>
                            <Tooltip title="Delete">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  userIsAdmin() &&
                                    deleteTeacherHandler(teacherid);
                                }}
                              >
                                <DeleteIcon></DeleteIcon>
                              </IconButton>
                            </Tooltip>
                          </StyledMenuRow>
                        </React.Fragment>
                      )
                    )}
                </SubMenu>
              </Menu>
            </div>
          </>
        )}
      </div>
      {/* {ADD STUDENT form and STUDENT LIST} */}
      <div>
        {(userIsAdmin() || userIsTeacher()) && (
          <>
            <div>
              <StyledForm>
                <StyledFormItem
                  htmlFor="studentname"
                  label="Add Student:"
                  validateStatus
                >
                  <Input
                    id="studentname"
                    name="studentname"
                    value={newStudent.studentname}
                    onChange={changeStudentValues}
                  />
                </StyledFormItem>
                <StyledSubmit>
                  <Button
                    onClick={addStudentHandler}
                    type="primary"
                    className="button"
                  >
                    Submit
                  </Button>
                </StyledSubmit>
              </StyledForm>
            </div>
            <div>
              <Menu
                style={{ width: '80%' }}
                defaultOpenKeys={['sub2']}
                mode="inline"
              >
                <SubMenu key="sub2" title="Registered Students">
                  {studentsMap?.enrolled &&
                    Object.entries(studentsMap.enrolled).map(
                      ([studentid, { studentname }]) => {
                        return (
                          <React.Fragment key={studentid}>
                            <StyledMenuRow>
                              <Menu.Item
                                key={studentid}
                                style={{ marginTop: '2.5%' }}
                              >
                                {studentname}
                              </Menu.Item>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    deleteStudentHandler(studentid)
                                  }
                                >
                                  <DeleteIcon></DeleteIcon>
                                </IconButton>
                              </Tooltip>
                            </StyledMenuRow>
                          </React.Fragment>
                        );
                      }
                    )}
                </SubMenu>
              </Menu>
              <div style={{ marginTop: '10px' }}>
                <Menu
                  style={{ width: '80%' }}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                >
                  <SubMenu key="sub6" title="Students">
                    {studentsMap?.available &&
                      Object.entries(studentsMap.available).map(
                        ([studentid, { studentname }]) => {
                          return (
                            <Menu.Item key={studentid}>
                              <StyledMenuRow>
                                {studentname}
                                <StyledSpan
                                  onClick={e => addStudent(e, studentname)}
                                >
                                  +
                                </StyledSpan>
                              </StyledMenuRow>
                            </Menu.Item>
                          );
                        }
                      )}
                  </SubMenu>
                </Menu>
              </div>
            </div>
          </>
        )}
      </div>
    </StyledContainer>
  );
};

// STYLED COMPONENTS
const StyledMenuRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 2%;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10%;
`;

const HeaderDiv = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  margin: 5% 0;
`;

const StyledSpan = styled.span`
  font-size: 24px;
  color: gray;
  :hover {
    color: lightgray;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  align-content: flex-end;
  margin-left: 1%;
`;

const StyledSubmit = styled.div`
  margin-left: 2%;
  padding-top: 5%;
`;

const StyledFormItem = styled(FormItem)`
  padding-top: 5%;
  margin-bottom: 0;
`;

export default ModuleList;
