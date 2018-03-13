import React from 'react';
import {
    Form,
    Button,
    Input,
    Container,
    Item,
}
from 'semantic-ui-react';

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
    const { authenticated, result } = props;
    return (
        <Item>
          <Item.Image size='tiny' src={result.image_url} />
    
          <Item.Content>
            <Item.Header as='a'>{ result.name }</Item.Header>
            <Item.Meta>Description..</Item.Meta>
            <Item.Description>
              
            </Item.Description>
            { (authenticated) && 
                <Item.Extra> 
                    <Button>Going</Button>
                </Item.Extra>
            }
          </Item.Content>
        </Item>
    );
}

export const SearchResults = (props) => {
    const { authenticated, results, bars } = props;
    console.log(bars);
    return (
        <Item.Group>
            { results.map(result => (
                <Result key={ result.id } result={result} authenticated={authenticated} />
            )) }
        </Item.Group>
    );
}