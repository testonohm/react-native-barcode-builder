import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import barcodes from 'jsbarcode/src/barcodes';

import Svg, { Path } from 'react-native-svg';

const Barcode = props => {
  const [bars, setBars] = useState([]);
  const [barCodeWidth, setBarCodeWidth] = useState(0);

  useEffect(() => {
    update();
  }, [props.value]);

  const update = () => {
    const encoder = barcodes[props.format];
    const encoded = encode(props.value, encoder, props);

    if (encoded) {
      setBars(drawSvgBarCode(encoded, props));
      setBarCodeWidth(encoded.data.length * props.width);
    }
  };

  const drawSvgBarCode = (encoding, options = {}) => {
    const rects = [];
    // binary data of barcode
    const binary = encoding.data;

    let barWidth = 0;
    let x = 0;
    let yFrom = 0;

    for (let b = 0; b < binary.length; b++) {
      x = b * options.width;
      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = drawRect(
          x - options.width * barWidth,
          yFrom,
          options.width * barWidth,
          options.height,
        );
        barWidth = 0;
      }
    }

    // Last draw is needed since the barcode ends with 1
    if (barWidth > 0) {
      rects[rects.length] = drawRect(
        x - options.width * (barWidth - 1),
        yFrom,
        options.width * barWidth,
        options.height,
      );
    }

    return rects;
  };

  const drawRect = (x, y, width, height) => {
    return `M${x},${y}h${width}v${height}h-${width}z`;
  };

  const getTotalWidthOfEncodings = encodings => {
    let totalWidth = 0;
    for (let i = 0; i < encodings.length; i++) {
      totalWidth += encodings[i].width;
    }
    return totalWidth;
  };

  // encode() handles the Encoder call and builds the binary string to be rendered
  const encode = (text, Encoder, options) => {
    // If text is not a non-empty string, throw error.
    if (typeof text !== 'string' || text.length === 0) {
      if (props.onError) {
        props.onError(
          new Error('Barcode value must be a non-empty string'),
        );
        return;
      }
      throw new Error('Barcode value must be a non-empty string');
    }

    let encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
      // If the encoder could not be instantiated, throw error.
      if (props.onError) {
        props.onError(new Error('Invalid barcode format.'));
        return;
      }
      throw new Error('Invalid barcode format.');
    }

    // If the input is not valid for the encoder, throw error.
    if (!encoder.valid()) {
      if (props.onError) {
        props.onError(new Error('Invalid barcode for selected format.'));
        return;
      }
      throw new Error('Invalid barcode for selected format.');
    }

    // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }
    const encoded = encoder.encode();
    return encoded;
  };

  const backgroundStyle = {
    backgroundColor: props.background,
  };
  return (
    <View style={[styles.svgContainer, backgroundStyle]}>
      <Svg
        height={props.height}
        width={barCodeWidth}
        fill={props.lineColor}
      >
        <Path d={bars.join(' ')} />
      </Svg>
      {typeof props.text != 'undefined' && (
        <Text
          style={{
            color: props.textColor,
            width: barCodeWidth,
            textAlign: 'center',
          }}
        >
          {props.text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10,
  },
});

Barcode.propTypes = {
  value: PropTypes.string,
  /* Select which barcode type to use */
  format: PropTypes.oneOf(Object.keys(barcodes)),
  /* Overide the text that is diplayed */
  text: PropTypes.string,
  /* The width option is the width of a single bar. */
  width: PropTypes.number,
  /* The height of the barcode. */
  height: PropTypes.number,
  /* Set the color of the bars */
  lineColor: PropTypes.string,
  /* Set the color of the text. */
  textColor: PropTypes.string,
  /* Set the background of the barcode. */
  background: PropTypes.string,
  /* Handle error for invalid barcode of selected format */
  onError: PropTypes.func,
};

Barcode.defaultProps = {
  value: undefined,
  format: 'CODE128',
  text: undefined,
  width: 2,
  height: 100,
  lineColor: '#000000',
  textColor: '#000000',
  background: '#ffffff',
  onError: undefined,
};

export default Barcode;
