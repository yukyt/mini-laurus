import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Waypoint from 'react-waypoint';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import AddToPhotosIcon from 'material-ui-icons/AddToPhotos';
import { toggleItem, scrollEnd } from '../actions/wardrobe';
import * as CONSTANTS from '../define';

class ItemList extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = value => () => {
      this.props.onItemClick(value);
    };
  }

  render() {
    return (
      <section style={{ display: this.props.viewMode === CONSTANTS.VIEW_MODE.WARDROBE ? '' : 'none' }}>
        <List>
          {this.props.items.slice(0, this.props.itemShowMaxCount).map(singleItem => (
            <ListItem
              key={singleItem.id}
              role={undefined}
              dense
              button
              className="wardrobe-item-list"
              style={{ backgroundColor: (singleItem.possession) ? 'white' : 'gray' }}
              disableRipple
            >
              <Checkbox
                checked={!singleItem.possession}
                tabIndex={-1}
                icon={<DeleteForeverIcon />}
                checkedIcon={<AddToPhotosIcon />}
                onClick={this.handleToggle(singleItem.id)}
              />
              <ListItemText primary={`${singleItem.name}`} />
            </ListItem>
          ))}
        </List>
        <Waypoint onEnter={() => {
            this.props.onScrollEnd();
          }}
        />
      </section>
    );
  }
}

ItemList.defaultProps = {
  items: [],
};

ItemList.propTypes = {
  viewMode: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onScrollEnd: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(Object),
  itemShowMaxCount: PropTypes.number.isRequired,
};

const getVisibleItems = (items, itemCategoryFilter) =>
  items.filter(item => (item.category === itemCategoryFilter));

const mapStateToProps = state => ({
  viewMode: state.viewMode,
  itemCategory: state.itemCategory,
  items: getVisibleItems(state.items, state.itemCategoryFilter),
  itemShowMaxCount: state.itemShowMaxCount,
});

const mapDispatchToProps = dispatch => ({
  onItemClick: (itemId) => {
    dispatch(toggleItem(itemId));
  },
  onScrollEnd: () => {
    dispatch(scrollEnd());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
