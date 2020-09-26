import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { HOST_LISTING } from "../../lib/graphql/mutations";
import {
  hostListing as hostListingData,
  hostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/hostListing";
import { Layout, Typography, Form, Input, InputNumber, Radio, Upload, Button } from "antd";
import { HomeOutlined, BankOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Viewer } from "../../lib/types";
import { Link, Redirect } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import { iconColor, displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { UploadChangeParam } from "antd/lib/upload";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation<hostListingData, hostListingVariables>(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your lsiting!");
    },
    onError: () => {
      displayErrorMessage("Sorry, We weren't able to create your listing. Please try again later.");
    },
  });

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getbase64Value(file.originFileObj, (value) => {
        setImageBase64Value(value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = (values: any) => {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

    const input: hostListingVariables["input"] = {
      type: values.type,
      title: values.title,
      description: values.description,
      address: fullAddress,
      numOfGuests: values.numOfGuests,
      image: imageBase64Value as string,
      price: values.price * 100,
    };

    hostListing({
      variables: { input },
    });
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected to Stripe to host a listing!
          </Title>
          <Text type="secondary">We're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have connected with Stripe to host new listings.
            You can sing in on the <Link to="/login">Login page</Link> and connect to Strip shortly after.
          </Text>
        </div>
      </Content>
    );
  }

  if (data?.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form layout="vertical" onFinish={handleHostListing}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information about your listing
          </Text>
        </div>

        <Item label="Home Type" name="type" rules={[{ required: true, message: "Please select a home type!" }]}>
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <HomeOutlined style={{ color: iconColor }} /> <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <BankOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label="Max # of guests"
          name="numOfGuests"
          rules={[{ required: true, message: "Please enter the max number of guests!" }]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          extra="Max character count of 400"
          name="title"
          rules={[{ required: true, message: "Please enter a title for your listing!" }]}
        >
          <Input maxLength={45} placeholder="The iconic and luxurious Bel-Air mansion" />
        </Item>

        <Item
          label="Description of listing"
          extra="Max character count of 45"
          name="description"
          rules={[{ required: true, message: "Please enter a description for your listing!" }]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean and iconic home of the Fresh Prince. Situated in the heart Bel-Air, Los Angeles"
          />
        </Item>

        <Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter an address for your listing!" }]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          rules={[{ required: true, message: "Please enter a city for your listing!" }]}
        >
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          rules={[{ required: true, message: "Please enter a state (or province) for your listing!" }]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[{ required: true, message: "Please enter a zip (pr postal) code for your listing!" }]}
        >
          <Input placeholder="Please enter a zip code for your listing" />
        </Item>

        <Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          name="image"
          rules={[{ required: true, message: "Please provide an image for your listing!" }]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="Listing" />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          extra="Price in $USD/day"
          name="price"
          rules={[{ required: true, message: "Please enter a price for your listing!" }]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage("You're only able to upload valid image files of under 1MB in size!");
    return false;
  }

  return fileIsValidImage && fileIsValidImage;
};

const getbase64Value = (img: File | Blob, callback: (value: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};
