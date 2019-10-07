import React from 'react';
import './App.css';
import {Dropdown, Button} from 'react-bootstrap';
import closeButton from './images/close.png';

class App extends React.Component {
  state = {
    selection: null,
    label: 'Category',
    result: [],
    containerClass: 'container',
    loading: false
  }

  _dropdownButton() {
    return (
      <Dropdown className='category-selection'>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {this.state.label}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => this.updateSelection('avg')}>AVG</Dropdown.Item>
            <Dropdown.Item onClick={() => this.updateSelection('ops')}>OPS</Dropdown.Item>
            <Dropdown.Item onClick={() => this.updateSelection('hr')}>HR</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    );
  }

  _goButton() {
    return (
      <Button className='button' title='Go' onClick={this.onSubmit}>GO</Button>
    );
  }

  _renderResultsList() {
    if (this.state.result !== null) {
      console.log(this.state.result);
      return (
        <ul>
          {this.state.result.map(item => this._renderResultItem(item))}
        </ul>
      );
    }
  }

  _renderResultItem(item) {
    let imageUrl = 'https://securea.mlb.com/mlb/images/players/head_shot/' + item.id + '@2x.jpg';
    return (
      <div className='result-item'>
        <div className='result-group'>
          <img className='headshot' src={imageUrl} />
          <div className="result-name">{item.name}</div>
        </div>
        <div className="result-value">{item.value}</div>
      </div>
    );
  }

  updateSelection = selection => {
    let label;
    switch(selection) {
      case 'avg':
        label = 'AVG';
        break;
      case 'ops':
        label = 'OPS';
        break;
      case 'hr':
        label = 'HR';
        break;
    }

    this.setState({
      selection: selection,
      label: label
    });
  }

  onSubmit = async () => {
    if (this.state.selection !== null) {
      const baseUrl = "http://lookup-service-prod.mlb.com/json/named.leader_hitting_repeater.bam?sport_code='mlb'&results=10&game_type='R'&season='2019'&sort_column=";
      const url = baseUrl + "'" + this.state.selection + "'&" + `leader_hitting_repeater.col_in=name_display_first_last,player_id,${this.state.selection}`;

      await fetch(url)
        .then(res => res.json())
        .then(async res => {
          let raw = res.leader_hitting_repeater.leader_hitting_mux.queryResults.row;
          let results = [];
          let resultImage;
          raw.forEach(async result => {
            results.push({
              name: result.name_display_first_last,
              value: result.hr || result.avg || result.ops,
              imageUrl: resultImage,
              id: result.player_id
            });
          });

          this.setState({result: results, containerClass: 'container container-active'});
        })
        .catch(err => console.log(err));

        this.setState({loading: false});
    }
  }

  render() {
    return (
      <div className={this.state.containerClass}>
        <h4>MLB Leaders</h4>
        <img className='close-button' src={closeButton} onClick={() => window.close()}/> 
        <div className='divider'/>
        <div className="button-container">
          {this._dropdownButton()}
          {this._goButton()}
        </div>
        {this._renderResultsList()}
      </div>
    );
  }
}

export default App;
