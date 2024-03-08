import React, { useEffect, useRef } from "react";
import { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import FrostedCard from "../Card/FrostedCard";

import "./SearchForm.css";

type categories = "default" | "music" | "sports" | "arts" | "film" | "misc";

interface FormState {
  keyword: string;
  distance: number;
  category: categories;
  location: string;
  autoDetect: boolean;
}

const initialFormState: FormState = {
  keyword: "",
  distance: 10,
  category: "default",
  location: "",
  autoDetect: false,
};

const SearchForm = (props: any) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!formState.keyword.trim()) {
      setOptions([]);
    } else {
      setLoading(true);
      setOptions([]);
      fetch(`/api/suggest?keyword=${formState.keyword}`)
        .then((response) => response.json())
        .then((data) => {
          setOptions(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [formState.keyword]);

  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleCheckboxClick = (
    event: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((state) => ({ ...state, autoDetect: !state.autoDetect }));
  };

  const handleChange = (event: React.ChangeEvent<any>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((state) => ({ ...state, [name]: value }));
  };

  const formSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit(formState);
  };

  const formResetHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setFormState(initialFormState);
    props.onClear();
  };

  return (
    <Row className="justify-content-center g-0">
      <Col xs={12} sm={8} md={5}>
        <FrostedCard title="Events Search">
          <Form onSubmit={formSubmitHandler} onReset={formResetHandler}>
            <Autocomplete
              loading={loading}
              loadingText={<CircularProgress className="mx-2" size={22} />}
              freeSolo
              options={options}
              inputValue={formState.keyword}
              onChange={(e, value) =>
                setFormState((state) => ({
                  ...state,
                  keyword: value ?? "",
                }))
              }
              filterOptions={(x) => x}
              onBlur={() => setOptions([])}
              onInputChange={(e, value) =>
                setFormState((state) => ({ ...state, keyword: value }))
              }
              renderInput={(params) => {
                return (
                  <>
                    <Form.Group className="mb-3" ref={params.InputProps.ref}>
                      <Form.Label {...params.InputLabelProps}>
                        Keyword<span className="asterisk"> *</span>
                      </Form.Label>
                      <input
                        type="text"
                        name="keyword"
                        required
                        {...params.inputProps}
                        className="form-control"
                      />
                    </Form.Group>
                  </>
                );
              }}
            />
            <Row>
              <Form.Group
                // as={Col}
                className="mb-3 col-xs-12 col-sm-6"
                controlId="distance"
              >
                <Form.Label>Distance</Form.Label>
                <Form.Control
                  type="number"
                  name="distance"
                  // defaultValue={10}
                  value={formState.distance}
                  onChange={handleChange}
                  placeholder="10"
                />
              </Form.Group>
              <Form.Group
                // as={Col}
                className="mb-3 col-xs-12 col-sm-6"
                controlId="category"
              >
                <Form.Label>
                  Category<span className="asterisk"> *</span>
                </Form.Label>
                <Form.Select
                  className="w-75"
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                >
                  <option value="default">Default</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts & Theatre</option>
                  <option value="film">Film</option>
                  <option value="misc">Miscellaneous</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>
                Location<span className="asterisk"> *</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formState.autoDetect ? "" : formState.location}
                onChange={handleChange}
                disabled={formState.autoDetect}
                required={!formState.autoDetect}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="autoDetect">
              <Form.Check
                type="checkbox"
                name="autoDetect"
                // onClick={handleCheckboxClick}
                onChange={handleCheckboxClick}
                // onChange={handleChange}
                checked={formState.autoDetect}
                label="Auto-detect your location"
                ref={checkboxRef}
              />
            </Form.Group>
            <div className="text-center">
              <Button className="mx-2" variant="danger" type="submit">
                SUBMIT
              </Button>
              <Button className="mx-2" variant="primary" type="reset">
                CLEAR
              </Button>
            </div>
          </Form>
        </FrostedCard>
      </Col>
    </Row>
  );
};

export default SearchForm;
