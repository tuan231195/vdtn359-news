import styled from 'styled-components';
import { Icon, Segment, Sidebar } from 'semantic-ui-react';

export const MenuSegment: any = styled(Segment)`
    &&&& {
        margin: 0;
        padding: 0;
        border-radius: 0;
        box-shadow: none;
        border: none;

        .sidebar {
            width: 200px !important;
            .item {
                text-align: left;
                padding: 10px 15px;
            }
        }
    }
`;

export const Pushable = styled(Sidebar.Pushable)`
    &&&& {
        .pushable:not(body) {
            transform: none;
        }

        .pushable:not(body) > .ui.sidebar,
        .pushable:not(body) > .fixed,
        .pushable:not(body) > .pusher:after {
            position: fixed;
            z-index: 2;
        }

        .sidebar {
            margin-top: 38px !important;
            padding-top: 20px;
            max-height: calc(100% - 38px) !important;
            overflow-x: hidden;
        }
    }
`;

export const MenuIcon = styled(Icon)`
    &&&&&&&& {
        display: inline-block;
        font-size: 1.1em !important;
        float: none;
        margin: 0em 0.35714286em 0em 0em;
        transform: translateY(-3px);
    }
`;
