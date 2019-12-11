import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class ItemList extends Component {
  componentDidMount() {}

  render() {
    const {item} = this.props;
    return (
      <View key={item.Id} styles={styles.card}>
        <View styles={styles.img}>
          <Image
            source={{
              uri: item.Images[0].ImageUrl,
            }}
            style={{width: 140, height: 140}}
          />
        </View>

        <View styles={styles.content}>
          {/* <Text styles={styles.name}>
                    {item.Name.length > 20
                      ? `${item.Name.substring(0, 20)}...`
                      : item.Name}
                  </Text> */}
          <Text styles={styles.price}>R${item.Sellers[0].ListPrice}</Text>
          <Text styles={styles.price}>R${item.Sellers[0].Price}</Text>
          <Text styles={styles.installment}>
            {item.Sellers[0].BestInstallment.Count}x $
            {item.Sellers[0].BestInstallment.Value}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
  },
  img: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  name: {
    fontSize: 9,
    width: 30,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexWrap: 'wrap',
  },
  content: {
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  price: {
    fontWeight: '700',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default ItemList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemList);
