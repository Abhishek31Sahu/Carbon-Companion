function GetDataSet({ data }) {
  const dataset = [];
  data.map((item, index) =>
    dataset.push({ quantity: item.co2e, producer: item.emission_factor.name })
  );
  console.log(dataset);
  return dataset;
}

export default GetDataSet;
