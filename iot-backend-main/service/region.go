package service

import (
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type RegionService struct {
	CityRepository           repository.CityRepository
	ProvinceRepository       repository.ProvinceRepository
	DistrictRepository       repository.DistrictRepository
	VillageRepository        repository.VillageRepository
	DeviceRepository         repository.DeviceRepository
	APIWilayahIndoRepository repository.APIWilayahIndoRepository
}

func (c *RegionService) CreateRegion(params *model.CreateRegionReq) error {
	tx := utils.InitTx()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	province, err := c.ProvinceRepository.InsertWithTx(tx, &model.Province{Name: params.ProvinceName})
	if err != nil {
		tx.Rollback()
		return err
	}

	citiesFromAPI, err := c.APIWilayahIndoRepository.FindCity(params.ProvinceID)
	if err != nil {
		tx.Rollback()
		return err
	}

	cities := make([]model.City, len(citiesFromAPI))
	for i, city := range citiesFromAPI {
		cities[i] = model.City{
			ProvinceID: province.ID,
			Name:       utils.ToCapitalCase(city.Name),
		}
	}

	cities, err = c.CityRepository.BulkInsertWithTx(tx, cities)
	if err != nil {
		tx.Rollback()
		return err
	}

	cityMap := make(map[string]int64)
	for _, city := range cities {
		cityMap[city.Name] = city.ID
	}

	var districtsToInsert []model.District
	for _, city := range citiesFromAPI {
		cityID, err := strconv.Atoi(city.ID)
		if err != nil {
			tx.Rollback()
			return err
		}

		districts, err := c.APIWilayahIndoRepository.FindDistrict(int64(cityID))
		if err != nil {
			tx.Rollback()
			return err
		}

		for _, district := range districts {
			districtsToInsert = append(districtsToInsert, model.District{
				CityID: cityMap[utils.ToCapitalCase(city.Name)],
				Name:   utils.ToCapitalCase(district.Name),
			})
		}
	}

	err = c.DistrictRepository.BulkInsertWithTx(tx, districtsToInsert)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (c *RegionService) CreateProvince(params *model.CreateProvinceRequest) (*model.ProvinceResponse, error) {
	provinceParams := model.Province{
		Name: params.Name,
	}

	province, err := c.ProvinceRepository.InsertProvince(&provinceParams)
	if err != nil {
		return nil, err
	}

	resp := model.ProvinceResponse{
		ID:   province.ID,
		Name: province.Name,
	}

	return &resp, nil
}

func (c *RegionService) CreateCity(params *model.CreateCityRequest) (*model.CreateCityResponse, error) {
	err := c.validateCreateCity(params)
	if err != nil {
		return nil, err
	}

	cityParams := model.City{
		Name:       params.Name,
		ProvinceID: params.ProvinceID,
	}

	city, err := c.CityRepository.InsertCity(&cityParams)
	if err != nil {
		return nil, err
	}

	resp := model.CreateCityResponse{
		ID:         city.ID,
		Name:       city.Name,
		ProvinceID: city.ProvinceID,
	}

	return &resp, nil
}

func (c *RegionService) CreateDistrict(params *model.CreateDistrictRequest) (*model.CreateDistrictResponse, error) {
	err := c.validateCreateDistrict(params)
	if err != nil {
		return nil, err
	}

	districtParams := model.District{
		Name:   params.Name,
		CityID: params.CityID,
	}

	district, err := c.DistrictRepository.InsertDistrict(&districtParams)
	if err != nil {
		return nil, err
	}

	resp := model.CreateDistrictResponse{
		ID:     district.ID,
		Name:   district.Name,
		CityID: district.CityID,
	}

	return &resp, nil
}

func (c *RegionService) CreateVillage(params *model.CreateVillageRequest) (*model.CreateVillageResponse, error) {
	err := c.validateCreateVillage(params)
	if err != nil {
		return nil, err
	}

	villageParams := model.Village{
		Name:       params.Name,
		DistrictID: params.DistrictID,
		Lat:        params.Lat,
		Long:       params.Long,
		Population: params.Population,
	}

	village, err := c.VillageRepository.InsertVillage(&villageParams)
	if err != nil {
		return nil, err
	}

	resp := model.CreateVillageResponse{
		ID:         village.ID,
		Name:       village.Name,
		DistrictID: village.DistrictID,
		Lat:        village.Lat,
		Long:       village.Long,
		Population: village.Population,
	}

	return &resp, nil
}

func (c *RegionService) GetProvinceList() ([]model.ProvinceResponse, error) {
	resp := make([]model.ProvinceResponse, 0)

	provinces, err := c.ProvinceRepository.Find()
	if err != nil {
		return nil, err
	}

	for _, province := range provinces {
		resp = append(resp, model.ProvinceResponse(province))
	}

	return resp, nil
}

func (c *RegionService) GetCityList(params *model.GetCityListRequest) ([]model.GetCityListResponse, error) {
	resp := make([]model.GetCityListResponse, 0)

	cities, err := c.CityRepository.Find(&model.FindCityParam{
		ProvinceID:        params.ProvinceID,
		IsDeviceInstalled: params.IsDeviceInstalled,
	})
	if err != nil {
		return nil, err
	}

	for _, city := range cities {
		c := model.GetCityListResponse{
			ID:   city.ID,
			Name: city.Name,
		}
		resp = append(resp, c)
	}

	return resp, nil
}

func (c *RegionService) GetDistrictList(params *model.GetDistrictListRequest) ([]model.GetDistrictListResponse, error) {
	resp := make([]model.GetDistrictListResponse, 0)

	districts, err := c.DistrictRepository.Find(&model.District{CityID: params.CityID})
	if err != nil {
		return nil, err
	}

	for _, district := range districts {
		d := model.GetDistrictListResponse{
			ID:   district.ID,
			Name: district.Name,
		}
		resp = append(resp, d)
	}

	return resp, nil
}

func (c *RegionService) GetVillageList(params *model.GetVillageListRequest) ([]model.GetVillageListResponse, error) {
	villages, err := c.VillageRepository.Find(&model.FindVillageRequest{
		IDs:        params.VillageIDs,
		DistrictID: params.DistrictID,
		Search:     params.Search,
		ExcludeIDs: params.ExcludeVillageIDs,
	})
	if err != nil {
		return nil, err
	}

	resp := make([]model.GetVillageListResponse, len(villages))
	for i, village := range villages {
		v := model.GetVillageListResponse{
			ID:   village.ID,
			Name: village.Name,
		}
		resp[i] = v
	}

	return resp, nil
}

func (c *RegionService) GetVillage(params *model.GetVillageRequest) (*model.GetVillageResponse, error) {
	village, err := c.VillageRepository.Get(&model.Village{ID: params.VillageID})
	if err != nil {
		return nil, err
	}

	device, err := c.DeviceRepository.Get(&model.Device{VillageID: params.VillageID})
	if err != nil {
		return nil, err
	}

	if device == nil || village == nil {
		return nil, gorm.ErrRecordNotFound
	}

	resp := model.GetVillageResponse{
		ID:          village.ID,
		VillageName: village.Name,
		VillageProfile: model.GetVillageProfile{
			FieldID:     village.FieldCode,
			Lat:         village.Lat,
			Long:        village.Long,
			Population:  village.Population,
			InstallDate: device.PumpInstallDate,
			PICName:     village.PicName,
			PICPhone:    village.PicContact,
		},
		DeviceProfile: model.GetDeviceProfile{
			DeviceID:    device.ID,
			DeviceCode:  device.Code,
			Brand:       device.Brand,
			Capacity:    device.Capacity,
			Power:       device.Power,
			Level:       device.Level,
			Type:        device.Type,
			InstallDate: device.PumpInstallDate,
		},
	}

	return &resp, nil
}
