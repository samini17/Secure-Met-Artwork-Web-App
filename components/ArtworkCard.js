import { Card, Button } from "react-bootstrap";
import Error from "next/error";
import Link from "next/link";
import useSWR from "swr";


const fetcher = async (...args) => { const response = await fetch(...args)
 const data = await response.json() 
 return data }
 
 export default function ArtworkCard(props) {
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`, fetcher)


console.log("data",data);

  if (error) return <Error statusCode={404} />;
  if (!data) return <div>loading</div>;

  return (
    <>
      <Card>
        <Card.Img variant="top"  src={ data.primaryImageSmall  ? data.primaryImageSmall : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]" } />
        <Card.Body>
          <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
          <Card.Text>
            {" "}
            <strong>Date: </strong>
            {data.objectDate ? data.objectDate : "N/A"}
          </Card.Text>
          <Card.Text>
            {" "}
            <strong>Classification: </strong>
            {data.classification ? data.classification : "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Medium: </strong>
            {data.medium ? data.medium : "N/A"}
          </Card.Text>
          <br />
          <Link href={`/artwork/${data.objectID}`} passHref>
            <Button variant="primary">ID: {data.objectID}</Button> 
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}

//This code is a function called ArtworkCard that is used to display information about a specific artwork from the Met Museum's public collection API. The function starts by using the SWR library to fetch the data from the API with the objectID passed in as an argument. If the fetching is successful, the data is displayed in a card with an image, title, date, classification, and medium. There is also a button that links to the objectID page. If there is an error, a 404 page will be displayed.

