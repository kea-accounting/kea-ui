import React from "react";
import PropTypes from "prop-types";
import { EditableCell, Column, Table, Utils } from "@blueprintjs/table";
import styled from "styled-components";

const REORDERABLE_TABLE_DATA = [
  ["A", "Apple", "Ape", "Albania", "Anchorage"],
  ["B", "Banana", "Boa", "Brazil", "Boston"],
  ["C", "Cranberry", "Cougar", "Croatia", "Chicago"],
  ["D", "Dragonfruit", "Deer", "Denmark", "Denver"],
  ["E", "Eggplant", "Elk", "Eritrea", "El Paso"]
].map(([letter, fruit, animal, country, city]) => ({
  letter,
  fruit,
  animal,
  country,
  city
}));

const Aligner = styled.div`
  margin-top: 50px;
  height: 100%;
`;

export default class ListPage extends React.Component {
  static propTypes = {
    data: PropTypes.object
  };

  state = {
    data: REORDERABLE_TABLE_DATA
  };

  componentDidMount() {
    const columns = [
      <Column key="1" name="Letter" renderCell={this.renderLetterCell} />,
      <Column key="2" name="Fruit" renderCell={this.renderFruitCell} />,
      <Column key="3" name="Animal" renderCell={this.renderAnimalCell} />,
      <Column key="4" name="Country" renderCell={this.renderCountryCell} />,
      <Column key="5" name="City" renderCell={this.renderCityCell} />
    ];
    this.setState({ columns });
  }

  render() {
    return (
      <Aligner>
        <Table
          isColumnReorderable={true}
          isColumnResizable={true}
          isRowReorderable={false}
          isRowResizable={false}
          numRows={this.state.data.length}
          onColumnsReordered={this.handleColumnsReordered}
          onRowsReordered={this.handleRowsReordered}
        >
          {this.state.columns}
        </Table>
      </Aligner>
    );
  }

  renderLetterCell = row => (
    <EditableCell value={this.state.data[row].letter} />
  );
  renderFruitCell = row => <EditableCell value={this.state.data[row].fruit} />;
  renderAnimalCell = row => (
    <EditableCell value={this.state.data[row].animal} />
  );
  renderCountryCell = row => (
    <EditableCell value={this.state.data[row].country} />
  );
  renderCityCell = row => <EditableCell value={this.state.data[row].city} />;

  handleColumnsReordered = (oldIndex, newIndex, length) => {
    if (oldIndex === newIndex) {
      return;
    }
    const nextChildren = Utils.reorderArray(
      this.state.columns,
      oldIndex,
      newIndex,
      length
    );
    this.setState({ columns: nextChildren });
  };

  handleRowsReordered = (oldIndex, newIndex, length) => {
    if (oldIndex === newIndex) {
      return;
    }
    this.setState({
      data: Utils.reorderArray(this.state.data, oldIndex, newIndex, length)
    });
  };
}
