import React, { useCallback } from 'react';
import Headroom from 'react-headroom';
import MediaQuery from 'react-responsive';
import styled, { css } from 'styled-components';

import { Link } from 'ts/components/documentation/shared/link';

import { MobileNav } from 'ts/components/docs/header/mobile_nav';
import { SubMenu } from 'ts/components/staking/header/sub_menu';

import { Hamburger } from 'ts/components/hamburger';
import { Logo } from 'ts/components/logo';
import { FlexWrap } from 'ts/components/newLayout';

import { ThemeValuesInterface } from 'ts/style/theme';
import { zIndex } from 'ts/style/z_index';

import { AccountState, ProviderState, WebsitePaths } from 'ts/types';

interface HeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
    onOpenConnectWalletDialog: () => void;
    onLogoutWallet: () => void;
    providerState: ProviderState;
}

interface NavLinkProps {
    link: NavItems;
    key: string;
}

interface NavItems {
    url?: string;
    id?: string;
    text?: string;
}

const navItems: NavItems[] = [
    {
        id: 'staking',
        text: 'Staking',
        url: WebsitePaths.Staking,
    },
    {
        id: 'governance',
        text: 'Governance',
        url: WebsitePaths.Vote,
    },
    {
        id: 'your-account',
        text: 'Your Account',
        url: WebsitePaths.Account,
    },
];

export const Header: React.FC<HeaderProps> = React.memo(({
    isNavToggled,
    providerState,
    toggleMobileNav,
    onOpenConnectWalletDialog,
    onLogoutWallet,
}) => {
    const onUnpin = useCallback(() => {
        if (isNavToggled) {
            toggleMobileNav();
        }
    }, [isNavToggled, toggleMobileNav]);

    const unpinAndOpenWalletDialog = useCallback(() => {
        onUnpin();
        onOpenConnectWalletDialog();
    }, [onUnpin, onOpenConnectWalletDialog]);

    const logoutWallet = useCallback(() => {
        onUnpin();
        onLogoutWallet();
    }, [onUnpin, onLogoutWallet]);

    const subMenu = (
        <SubMenu
            openConnectWalletDialogCB={unpinAndOpenWalletDialog}
            logoutWalletCB={logoutWallet}
            providerState={providerState}
        />
    );

    const isWalletConnected = providerState.account.state === AccountState.Ready;
    return (
        <Headroom
            onUnpin={onUnpin}
            downTolerance={4}
            upTolerance={10}
            wrapperStyle={{ position: 'relative', zIndex: 2 }}
        >
            <StyledHeader isNavToggled={isNavToggled}>
                <HeaderWrap>
                    <LogoWrap>
                        <Link to={WebsitePaths.Home}>
                            <Logo />
                        </Link>
                        <DocsLogoWrap>
                            / <DocsLogoLink to={WebsitePaths.Staking}>ZRX</DocsLogoLink>
                        </DocsLogoWrap>
                    </LogoWrap>

                    <MediaQuery minWidth={1200}>
                        <NavLinks>
                            {navItems.map((link, index) => (
                                <NavItem key={`navlink-${index}`} link={link} />
                            ))}
                        </NavLinks>
                        {subMenu}
                    </MediaQuery>

                    <MediaQuery maxWidth={1199}>
                        <div style={{ position: 'relative' }}>
                            <WalletConnectedIndicator isConnected={isWalletConnected} isNavToggled={isNavToggled} />
                            <Hamburger isOpen={isNavToggled} onClick={toggleMobileNav} />
                        </div>
                        <MobileNav
                            navItems={navItems}
                            isToggled={isNavToggled}
                            toggleMobileNav={toggleMobileNav}
                            hasBackButton={false}
                            hasSearch={false}
                            navHeight={isWalletConnected ? 426 : 365}
                        >
                            {subMenu}
                        </MobileNav>
                    </MediaQuery>
                </HeaderWrap>
            </StyledHeader>
        </Headroom>
    );
});

const NavItem: React.FC<NavLinkProps> = React.memo(({ link }) => {
    const linkElement = link.url ? (
        <StyledNavLink to={link.url}>{link.text}</StyledNavLink>
    ) : (
        <StyledAnchor href="#">{link.text}</StyledAnchor>
    );
    return <LinkWrap>{linkElement}</LinkWrap>;
});

interface StyledHeaderProps {
    isNavToggled?: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
    padding: 30px;
    background-color: white;
`;

interface WalletConnectedIndicatorProps {
    isConnected: boolean;
    isNavToggled: boolean;
}
const WalletConnectedIndicator = styled.div<WalletConnectedIndicatorProps>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: ${props => (props.isConnected ? '#00AE99' : '#E71D36')};
    transition: opacity 0.25s ease-in;
    opacity: ${props => (props.isNavToggled ? 0 : 1)};
    position: absolute;
    top: -7px;
    right: -7px;
    z-index: ${zIndex.header + 1};
`;

const DocsLogoWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    font-size: var(--defaultHeading);
    color: rgba(0, 0, 0, 0.5);
    margin-left: 0.875rem;
    z-index: ${zIndex.header};
`;

const DocsLogoLink = styled(Link)`
    margin-left: 0.625rem;
`;

const LinkWrap = styled.li`
    position: relative;

    a {
        display: block;
    }

    @media (min-width: 1200px) {
        &:hover > div {
            display: block;
            visibility: visible;
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 0.35s, transform 0.35s, visibility 0s;
        }
    }
`;

const linkStyles = css<{ theme: ThemeValuesInterface }>`
    color: ${({ theme }) => theme.textColor};
    opacity: 0.5;
    transition: opacity 0.35s;
    padding: 15px 0;
    margin: 0 30px;

    &:hover {
        opacity: 1;
    }
`;

const StyledNavLink = styled(Link).attrs({
    activeStyle: { opacity: 1 },
})`
    ${linkStyles};
`;

const StyledAnchor = styled.a`
    ${linkStyles};
    cursor: default;
`;

const HeaderWrap = styled(FlexWrap)`
    justify-content: space-between;
    align-items: center;

    @media (max-width: 800px) {
        padding-top: 0;
        display: flex;
        padding-bottom: 0;
    }
`;

const NavLinks = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 800px) {
        display: none;
    }
`;

const LogoWrap = styled.div`
    display: flex;
    align-items: center;
`;