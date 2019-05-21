import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { CREATE_USER_PREFERENCE } from 'app/mutations';
import 'app/styles/components/Categories.scss';

const CATEGORIES_QUERY = gql`
  query categories {
    categories {
      name
      id
      tags {
        id
        name
      }
    }
  }
`;

const radiusMilesOpts = [
  0.25,
  0.5,
  1,
  2,
  3,
  'whole city',
]

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mutationVariables: {
      }
    }
  }

  render() {
    return <Query
      query={CATEGORIES_QUERY}
      fetchPolicy="network-only"
    >
      { ({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div className="alert-danger">Sorry, there was an error.</div>;
          // <Mutation mutation={CREATE_USER_PREFERENCE} variables={{ location_x, location_y, send_types, subscriptions }}>
          // USE EXISTING LOCATION AND OTHER SEND TYPES AS GRABBED FROM PROPS
        console.log(this.props)
        return (
            <div className="categories-list">
              {data.categories.map(cat => (
                <div key={cat.id} className="category-item">
                  {data.categories.length > 1 && <div className="category-title">Category: {cat.name}</div>}
                  <ul className="tags-list">
                    {cat.tags && cat.tags.map(tag => {
                      // const userSub = this.props.userSubscriptions ? this.props.userSubscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                      const userSub = undefined;
                      let userPreference = 'whole city';
                      if (userSub) {
                        userPreference = userSub.whole_city ? 'whole city' : userSub.radius_miles;
                      }

                      return (<li key={tag.id} className="tag-item">
                        <input type="checkbox" name={tag.name} value={tag.id}/>
                        <span>{tag.name}</span>
                        <select defaultValue={userPreference}>
                          {radiusMilesOpts.map(opt => (
                            <option
                              key={`${opt}-opt`}
                              value={opt}
                            >
                              {isNaN(opt) ? opt : `${opt} mile${opt % 1 === 0 ? '' : 's'}`}
                            </option>
                          ))}
                        </select>
                      </li>);
                    })}
                  </ul>
                </div>
              ))
            }
          </div>
)
      }}
    </Query>
  }
        // </Mutation>
}

export default Categories;
