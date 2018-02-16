import React from 'react';
import Header from './Header';
import TicketList from './TicketList';
import NewTicketControl from './NewTicketControl';
import Moment from 'moment';
import Admin from './Admin';
import { v4 } from 'uuid';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterTicketList: {
        1: {
          names: 'tyler and claire',
          location: 'Dover, DE',
          issue: 'never enough corn dogs'
        }
      },
      selectedTicket: null
    };
    this.handleAddingNewTicketToList = this.handleAddingNewTicketToList.bind(this);
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this);
    this.handleRemovingTicketFromList = this.handleRemovingTicketFromList.bind(this);
  }

  handleChangingSelectedTicket(ticketId){
    this.setState({selectedTicket: ticketId});
  }

  //edited in LHTP BP for structuring complex state 2
  handleAddingNewTicketToList(newTicket){
    let newTicketId = v4();
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList, {
      [newTicketId]: newTicket
    });
    newMasterTicketList[newTicketId].formattedWaitTime = newMasterTicketList[newTicketId].timeOpen.fromNow(true);
    this.setState({masterTicketList: newMasterTicketList});
    this.handleRemovingTicketFromList(newTicketId);
    //^call this someplace else
  }


  handleRemovingTicketFromList(ticketKey){
    let newMasterTicketList = this.state.masterTicketList;


    /// not delete but...



    this.setState({masterTicketList: newMasterTicketList});


    // let newTicketId = v4();
    // let newMasterTicketList = Object.assign({}, this.state.masterTicketList, {
    //   [newTicketId]: newTicket
    // });
    // newMasterTicketList[newTicketId].formattedWaitTime = newMasterTicketList[newTicketId].timeOpen.fromNow(true);
    // this.setState({masterTicketList: newMasterTicketList});
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  updateTicketElapsedWaitTime() {
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    Object.keys(newMasterTicketList).forEach((ticketId) => {
      newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    });
    this.setState({masterTicketList: newMasterTicketList});
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  render(){
    return (
      <div>
        <Header />
        <h1 onClick = {() => {
          console.log(this.state.masterTicketList);
        }}>click me!</h1>
        <Switch>
          <Route exact path='/' render={()=><TicketList ticketList={this.state.masterTicketList} />} />
          <Route path='/newticket' render={()=><NewTicketControl onNewTicketCreation={this.handleAddingNewTicketToList} />} />
          <Route path='/admin' render={(props)=><Admin ticketList={this.state.masterTicketList} currentRouterPath={props.location.pathname}
            onTicketSelection={this.handleChangingSelectedTicket}
            selectedTicket={this.state.selectedTicket}/>} />
        </Switch>
      </div>
    );
  }

}

export default App;
