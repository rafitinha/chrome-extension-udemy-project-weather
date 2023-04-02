import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Button,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
import { fetchOpenWeatherData, OpenWeatherData } from "../../utils/api";

const WeatherCardContainer: React.FC<{
  children: React.ReactNode;
  onDelete?: () => void;
}> = ({ children, onDelete }) => {
  return (
    <Box mx={"4px"} my={"16px"}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button color="secondary" onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

type WeatherCardState = "loading" | "error" | "ready";

const WeatherCard: React.FC<{ city: string; onDelete?: () => void }> = ({
  city,
  onDelete,
}) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>("loading");

  useEffect(() => {
    fetchOpenWeatherData(city)
      .then((data) => {
        setWeatherData(data);
        setCardState("ready");
        //console.log(data);
      })
      .catch((err) => {
        setCardState("error");
        console.log(err);
      });
  }, [city]);

  if (cardState == "error" || cardState == "loading") {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography variant="body1">
          {cardState == "loading"
            ? `Loading Info of City: ${city}...`
            : `Error: Could not retrieve weather data for this city.
               Searching | Recovering | Looking  for ${city} `}
        </Typography>
      </WeatherCardContainer>
    );
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Typography variant="h5">{weatherData.name}</Typography>
      <Typography variant="body1">
        {Math.round(weatherData.main.temp)}
      </Typography>
      <Typography variant="body1">
        Feels like:{Math.round(weatherData.main.feels_like)}
      </Typography>
    </WeatherCardContainer>
  );
};

export default WeatherCard;
