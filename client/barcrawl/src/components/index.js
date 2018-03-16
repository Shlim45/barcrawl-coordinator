import React, {Component} from 'react';
import {
    Form,
    Button,
    Input,
    Container,
    Item,
}
from 'semantic-ui-react';

import '../styles/components.css';

export const SearchForm = (props) => {
    const { onChange, onSubmit, city } = props; // , results
    return (
        <Container text>
        <Form>
            <Form.Field>
                <Input
                  name="city"
                  onChange={onChange}
                  value={city}
                  placeholder="WHERE YOU AT?"
                  fluid
                />
            </Form.Field>
            <Button onClick={onSubmit}>Submit</Button>
        </Form>
        </Container>
    );
};

export class Result extends Component {
    constructor(props) {
        super(props);
        
        const { authenticated, result, isGoing } = this.props;
        
        this.state = {
            authenticated,
            result,
            isGoing,
        };
    }
    
    componentWillReceiveProps(nextProps) {
        // should only be receiving authenticated & isGoing??
        const nextAuth = nextProps.authenticated;
        const nextGoing = nextProps.isGoing;
        
        this.setState({nextAuth, nextGoing});
    }
    
    render() {
        const { handleGoing, authenticated, result, bars, isGoing } = this.props;
        // check if bars array has result.id in it
    
        const bar = bars.filter(bar => bar.id === result.id)[0]; // only grab one bar
    
        const peopleGoing = (bar !== undefined)
            ? bar.going.length
            : 0;
        
        return (
            <Item className="result">
              <Item.Image size='tiny' src={result.image_url} />
        
              <Item.Content>
                <Item.Header as='a' href={ result.url }>{ result.name }</Item.Header>
                <Item.Meta>{ result.display_phone }</Item.Meta>
                {!result.is_closed &&
                    <Item.Extra>
                        <span>Open Now!</span>
                        <span>
                        { (authenticated) && 
                                <Button onClick={handleGoing.bind(null, result.id)}>{ peopleGoing } Going {isGoing ? '✔️' : ''}</Button>
                        }
                        </span>
                    </Item.Extra>
                }
                
                <Item.Description>
                {result.location.display_address.map((line, index) => (
                    <div key={index} className="address">{line}</div>
                ))}
                </Item.Description>
                
                
              </Item.Content>
            </Item>
        );
    }
};

// bar={YelpAPI}, allBars=[{id, going},...], userId=mongo._id
function isUserGoing(bar, allBars, userId) {
    if (!userId) return;
    const foundBar = allBars.filter(barX => barX.id === bar.id)[0];
    
    const idsGoing = foundBar ? foundBar.going.map(goingObj => goingObj.user) : null;
    return idsGoing ? idsGoing.includes(userId) : false;
}

export const SearchResults = (props) => {
    const { results, bars, userId } = props;

    return (
        <Item.Group>
            { results.map(result => {
                // const count = getGoingCount(result, bars);
                const isGoing = isUserGoing(result, bars, userId);

                return <Result key={ result.id } result={result} isGoing={isGoing} {...props} />;
            }) }
        </Item.Group>
    );
};