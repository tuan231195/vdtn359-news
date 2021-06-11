import React, { useMemo } from 'react';
import { Button, Dropdown, Form, Input, Segment } from 'semantic-ui-react';
import { SearchFilter } from 'src/utils/filter';
import { str } from '@vdtn359/news-utils';
import { CATEGORY } from '@vdtn359/news-models';
import { useMonitoring } from 'src/utils/hooks/basic';

interface Props {
    filter: SearchFilter;
    onFilterUpdate: (filter: SearchFilter) => void;
}

export const SearchFilterOptions: React.FC<Props> = ({
    filter,
    onFilterUpdate,
}) => {
    const [currentFilter, setCurrentFilter] = useMonitoring({ value: filter });
    const categoryOptions = useMemo(() => {
        return Object.keys(CATEGORY).map((category) => ({
            text: str.ucfirst(category),
            value: category,
        }));
    }, []);
    return (
        <Segment>
            <Form onSubmit={() => onFilterUpdate(currentFilter)}>
                <Form.Field>
                    <label>Search</label>
                    <Input
                        placeholder={'Search...'}
                        value={currentFilter.search}
                        onChange={(e) => {
                            setCurrentFilter({
                                ...currentFilter,
                                search: e.target.value,
                            });
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Categories</label>
                    <Dropdown
                        placeholder="Select categories"
                        fluid
                        value={currentFilter.categories}
                        multiple={true}
                        search
                        selection
                        onChange={(e, data) => {
                            setCurrentFilter({
                                ...currentFilter,
                                categories: data.value as any,
                            });
                        }}
                        options={categoryOptions}
                    />
                </Form.Field>
                <Button type="submit" primary>
                    Apply
                </Button>
                <Button
                    type="button"
                    onClick={() =>
                        onFilterUpdate({
                            search: '',
                            categories: [],
                        })
                    }
                >
                    Clear
                </Button>
            </Form>
        </Segment>
    );
};
