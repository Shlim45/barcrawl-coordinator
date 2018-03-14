import React from 'react';
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

export const Result = (props) => {
    const { handleGoing, authenticated, result, bars } = props;
    // check if bars array has result.id in it

    const bar = bars.filter(bar => bar.id === result.id)[0]; // only grab one bar

    const peopleGoing = (bar !== undefined)
        ? bar.going.length
        : 0;
    return (
        <Item className="result">
          <Item.Image size='tiny' src={result.image_url} />
    
          <Item.Content>
            <Item.Header as='a' href={result.url }>{ result.name }</Item.Header>
            <Item.Meta>{ result.display_phone }</Item.Meta>
            {!result.is_closed &&
                <Item.Extra>
                    <span>Open Now!</span>
                    <span>
                    { (authenticated) && 
                            <Button onClick={handleGoing.bind(this, result.id)}>{ peopleGoing } Going</Button>
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

export const SearchResults = (props) => {
    const { results } = props;

    return (
        <Item.Group>
            { results.map(result => (
                <Result key={ result.id } result={result} {...props} />
            )) }
        </Item.Group>
    );
}