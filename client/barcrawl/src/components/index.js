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
    const { result } = props;
    return (
        <Item>
          <Item.Image size='tiny' src={result.image_url} />
    
          <Item.Content>
            <Item.Header as='a'>{ result.name }</Item.Header>
            <Item.Meta>Description..</Item.Meta>
            <Item.Description>
              
            </Item.Description>
            <Item.Extra>Additional Details</Item.Extra>
          </Item.Content>
        </Item>
    );
}

export const SearchResults = (props) => {
    const { results } = props;
    return (
        <Item.Group>
            { results.map(result => (
                <Result key={ result.id }result={result} />
            )) }
        </Item.Group>
    );
}