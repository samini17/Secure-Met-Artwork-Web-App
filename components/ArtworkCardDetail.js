import { Card, Button } from "react-bootstrap";
import Error from "next/error";
import useSWR from "swr";
import Link from "next/link";
import { favouritesAtom } from "../store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { addToFavourites, removeFromFavourites } from "../lib/UserData";

const fetcher = async (...args) => { const response = await fetch(...args)
  const data = await response.json() 
  return data }
  
  export default function ArtworkCardDetail(result) {
   const { data, error } = useSWR(result.objectID?`https://collectionapi.metmuseum.org/public/collection/v1/objects/${result.objectID}`: null, fetcher)
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(result.objectID));
  }, [favouritesList]);
  
//1
  async function favouritesClicked() {    
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(result.objectID));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(result.objectID));
      setShowAdded(true);
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return <div>loading...</div>;

  return (
    <>
      <Card>
        <Card.Img
          variant="top" src={ data.primaryImage ? data.primaryImage  : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"  } />
        <Card.Body>
          <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>
            {data.objectDate ? data.objectDate : "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Classification: </strong>
            {data.classification ? data.classification : "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Medium: </strong>
            {data.medium ? data.medium : "N/A"}
          </Card.Text>
          <br />
          <br />
          <Card.Text>

            <strong>Artist: </strong>
            {data.artistDisplayName}{" "}
            {data.artistDisplayName ? (  <Link href={data.artistWikidata_URL} target="_blank">  (wiki) </Link>
              ) : (
              "N/A"
            )}
          </Card.Text>
          <Card.Text>
            <strong>Credit Line: </strong>
            {data.creditLine ? data.creditLine : "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Dimensions: </strong>
            {data.dimensions ? data.dimensions : "N/A"}
            <br />
            <br />
            <Button
              variant={showAdded ? "primary" : "outline-primary"}
              onClick={favouritesClicked}
            >
              {" "}
              {showAdded ? "+ Favourite (added)" : "+ Favourite"}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
