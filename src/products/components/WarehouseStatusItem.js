const WarehouseStatusItem = (props) => {
  return (
    <tbody>
      <tr>
        <td>{props.productName}</td>
        <td>{props.quantity}</td>
      </tr>
    </tbody>
  );
};

export default WarehouseStatusItem;
