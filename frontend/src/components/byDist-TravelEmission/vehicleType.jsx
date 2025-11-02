function VehicleTYpe(fuelType) {
  const carTypes =
    fuelType === "Diesel" || fuelType === "Petrol"
      ? [
          "Car-Type-Mini",
          "Car-Type-Supermini",
          "Car-Type-LowerMedium",
          "Car-Type-UpperMedium",
          "Car-Type-Executive",
          "Car-Type-Luxury",
          "Car-Type-Sports",
          "Car-Type-4x4",
          "Car-Type-MPV",
        ]
      : [];

  const carSizes =
    fuelType === "Diesel" || fuelType === "Petrol"
      ? [
          "Car-Size-Small",
          "Car-Size-Medium",
          "Car-Size-Large",
          "Car-Size-Average",
        ]
      : fuelType === "CNG"
      ? [
          {
            key: "passenger_vehicle-vehicle_type_small_car-fuel_source_cng-distance_na-engine_size_na",
            value: "Car-Size-Small",
          },
          {
            key: "passenger_vehicle-vehicle_type_large_car-fuel_source_cng-distance_na-engine_size_na",
            value: "Car-Size-Large",
          },
        ]
      : [];
  const BioCNGOption = [
    {
      key: "passenger_vehicle-vehicle_type_small_car-fuel_source_bio_cng-distance_na-engine_size_na",
      value: "Car-Size-Small",
    },
    {
      key: "passenger_vehicle-vehicle_type_medium_car-fuel_source_bio_cng-distance_na-engine_size_na",
      value: "Car-Size-Medium",
    },
    {
      key: "passenger_vehicle-vehicle_type_large_car-fuel_source_bio_cng-distance_na-engine_size_na",
      value: "Car-Size-Large",
    },
  ];
  const motorbikeSizes =
    fuelType === "Petrol"
      ? [
          "Motorbike-Size-Small",
          "Motorbike-Size-Medium",
          "Motorbike-Size-Large",
          "Motorbike-Size-Average",
        ]
      : [];
  const busTypes =
    fuelType === "Diesel"
      ? ["Bus-LocalAverage", "Bus-Coach"]
      : fuelType === "CNG"
      ? [
          {
            key: "passenger_vehicle-vehicle_type_bus_line-fuel_source_cng-distance_na-engine_size_na",
            value: "Bus",
          },
          {
            key: "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_20t_lt_26t-distance_uplift_included",
            value: "Rigid-Truck-wt_20-26",
          },
          {
            key: "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_12t_lt_20t-distance_uplift_included",
            value: "Rigid-Truck-wt_12-20",
          },
        ]
      : [];
  const taxiTypes =
    fuelType === "Diesel" || fuelType === "Petrol" ? ["Taxi-Local"] : [];

  const vehicleOptions =
    fuelType === "BioCNG"
      ? [...BioCNGOption]
      : [
          ...carTypes,
          ...carSizes,
          ...motorbikeSizes,
          ...busTypes,
          ...taxiTypes,
        ];
  return vehicleOptions;
}

export default VehicleTYpe;
