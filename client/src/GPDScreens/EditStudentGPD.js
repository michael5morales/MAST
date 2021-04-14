import React, { Component} from 'react'
import { Card, Row, Col, Navbar, TextInput, Button, Collapsible, CollapsibleItem, Table } from 'react-materialize'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Checkbox } from 'react-materialize';

class EditStudentGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStudent: this.props.location.state.currentEditStudent,
            firstName: this.props.location.state.currentEditStudent.User.firstName,
            lastName: this.props.location.state.currentEditStudent.User.lastName,
            email: this.props.location.state.currentEditStudent.User.email,
            major: this.props.location.state.currentEditStudent.department,
            entrySemester: this.props.location.state.currentEditStudent.entrySemester,
            track: this.props.location.state.currentEditStudent.track,
            sbuID: this.props.location.state.currentEditStudent.sbuID,
            expectedGraduation: "",
            degreeData: [],
            comments: this.props.location.state.comments,
            rerender: false,
            currentComment: ""
        };
    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    onChangeName = (event) => {
        let nameStr = event.target.value.split(" ");
        this.setState({firstName: nameStr[0], lastName: nameStr[1]});
    }

    confirmEdit = async () => {
        let body = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, sbuID: this.state.sbuID, department: this.state.department, entrySemester: this.state.entrySemester, track: this.state.track};        
        console.log(body)
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };    
        axios.post("http://localhost:5000/api/edit_student", body, header).catch((error) => console.log(error));

        await axios.get('/api/students')        
    }

    confirmAddComment = async () => {
        let newComments = this.state.comments
        console.log(this.state.currentComment);
        newComments.push({message: this.state.currentComment});
        console.log(newComments);
        let body = {sbuID: this.state.sbuID, comment: this.state.currentComment};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 
        let res = await axios.post("http://localhost:5000/api/comments/add_comment", body, header).then(this.setState({comments: newComments})).catch((err) => console.log(err));
    }

    getDegreeRequirements = async () => {
        let degrees = await axios.get('api/degrees');
        let degreeData = degrees.data
        for(let i = 0; i < degreeData.length; i++){
            let tempDegree = degreeData[i];
            console.log(tempDegree);
            if(this.state.major.replace(/ /g,'') == tempDegree.department){
                console.log(this.state.degreeData)
                this.setState({
                    degreeData: degreeData[i].json,
                    rerender: true
                });
                console.log(this.state.degreeData)
                break;
            }
        }
    }

    componentDidMount = () => {
        this.getDegreeRequirements();
    }

    render(){
        let dropdown;
        if (this.state.major.replace(/ /g,'') == "AMS" && this.state.rerender) {
            if(this.state.track == "Computational Applied Mathematics"){
                dropdown = <div>
                    <Collapsible disabled>
                        {this.state.degreeData.requirements.tracks.comp.map((course) => (
                            <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                        ))}
                        <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                    </Collapsible>
                </div>;
            }
            else if(this.state.track == "Operations Research"){
                dropdown = <div>
                <Collapsible disabled>
                    {this.state.degreeData.requirements.tracks.op.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Computational Biology"){
                dropdown = <div>
                <Collapsible disabled>
                    {this.state.degreeData.requirements.tracks.bio.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Statistics"){
                dropdown = <div>
                <Collapsible disabled>
                    {this.state.degreeData.requirements.tracks.stats.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
            else if(this.state.track == "Quanitative Finance"){
                dropdown = <div>
                <Collapsible disabled>
                    {this.state.degreeData.requirements.tracks.quan.map((course) => (
                        <CollapsibleItem icon={<Checkbox />} header={course}></CollapsibleItem>
                    ))}
                    <CollapsibleItem icon={<Checkbox />} header={this.state.degreeData.requirements.final_recommendation.name}></CollapsibleItem>
                </Collapsible>
                </div>;
            }
        }
        return(
            <div align="left">
                <Navbar className="blue"></Navbar>
                <br></br>
                <Row>
                    <Col l={6}>
                        <b>Edit Student: {this.state.firstName + " " + this.state.lastName}</b>
                    </Col>
                    <Col l={6}>
                        <b>View/Edit Comments</b>
                    </Col>
                </Row>
                <Row>
                    <Col l={6}>
                        <Card className="blue-grey">
                            <Row>
                                <Col l={6}>
                                    <span align="left" class="white-text">Full Name:</span>
                                </Col>
                                <Col l={6}>
                                    <span class="white-text">Major:</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChangeName} value={this.state.firstName + " " + this.state.lastName} id ="fullName">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.major} id="major">
                                    </TextInput>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <span align="left" class="white-text">Email:</span>
                                </Col>
                                <Col l={6}>
                                    <span class="white-text">Entry Semester:</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.email} id="email">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.entrySemester} id="entrySemester">
                                    </TextInput>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <span align="left" class="white-text">SBU ID:</span>
                                </Col>
                                <Col l={6}>
                                    <span class="white-text">Expected Graduation:</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.sbuID} id="sbuID">
                                    </TextInput>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.expectedGraduation} id="expectedGraduation"> 
                                    </TextInput>
                                </Col>
                            </Row>
                            <Row>
                            <Col l={6} offset="l6">
                                    <span align="left" class="white-text">Track:</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <Button onClick={this.confirmEdit}>Confirm Changes</Button>
                                </Col>
                                <Col l={6}>
                                    <TextInput class="white" onChange={this.onChange} value={this.state.track} id="track"> 
                                    </TextInput>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col l="6">
                        <Card className="blue-grey">
                            <Row>
                                <Col l={6}>
                                    <Collapsible>
                                        {this.state.comments.map((comment) =>
                                        (<CollapsibleItem header={comment.message}></CollapsibleItem>))}
                                    </Collapsible>
                                </Col>
                                <Col><TextInput placeholder="Comment..." class="white" value={this.state.currentComment} onChange={this.onChange} id="currentComment"></TextInput></Col>
                            </Row>
                            <Row>
                                <Col l={6}>
                                    <Button>Delete Comment</Button>
                                </Col>
                                <Col l={6}>
                                    <Button onClick={this.confirmAddComment}>Add Comment</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col l={6}>
                        <b>Current Course Plan:</b>
                    </Col>
                    <Col l={6}>
                        <b>Degree Requirements:</b>
                    </Col>
                </Row>
                <Row>
                    <Col l={6}>
                    <Card className="blue-grey">
                        <Row>
                        <Col l={12}>
                            <Table className="white">
                                <thead>
                                    <tr>
                                    <th>Course</th>
                                    <th>Credit(s)</th>
                                    <th>Time</th>
                                    <th>Professor</th>
                                    <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>AMS 501</td>
                                        <td>3</td>
                                        <td>T/Th 4:00PM-5:20PM</td>
                                        <td>John Doe</td>
                                        <td>Javits 100</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        </Row>
                    </Card>
                    </Col>
                    <Col l={6}>
                    <Card className="blue-grey">
                        <Row>
                        <Col l={12}>
                            {dropdown}
                        </Col>
                        </Row>
                    </Card>
                    </Col>    
                </Row>
                <Link to="/manage_students_gpd">
                    <Button>Return Home</Button>
                </Link>
            </div>
            
        );
    }
}
export default EditStudentGPD;