import { graphql } from "@/gql";
import { useContext, useEffect } from "react";
import { useQuery } from "urql";
import { removeDuplicatesByField } from "../common";
import { refetchContext } from "../urql";

const EtchFragment = graphql(`
  fragment EtchFragment on Etch {
    id
    tokenId
    createdAt
    documentName
    description

    tagLinks(where: { owner: $userId }) {
      tag {
        id
        label
      }
    }

    ownership {
      id
      owner {
        id
        etchENS {
          id
          name
        }
      }
      team {
        id
        teamId
        name
      }
    }
  }
`);

const GET_ETCHES_FROM_USER_ETCHES_QUERY = graphql(`
  query Etches($userId: String) {
    etches(
      first: 1000
      orderBy: createdAt
      where: { or: [{ ownership_: { owner: $userId } }, { permissions_: { wallet: $userId, permissionLevel_gt: 0 } }] }
    ) {
      id
      ...EtchFragment
    }

    teams(
      where: { or: [{ ownership_: { owner: $userId } }, { permissions_: { wallet: $userId, permissionLevel_gt: 0 } }] }
      first: 1000
    ) {
      id
      managedEtches {
        id
        etch {
          ...EtchFragment
        }
      }
      externalEtches {
        etch {
          id
          ...EtchFragment
        }
      }
    }

    organisations(where: { ownership_: { owner: $userId } }, first: 1000) {
      id
      managedTeams {
        id
        team {
          id
          managedEtches {
            id
            etch {
              ...EtchFragment
            }
          }
          externalEtches {
            etch {
              id
              ...EtchFragment
            }
          }
        }
      }
    }
  }
`);

export const useGetEtchesFromUser = (userId?: string) => {
  const [{ data: etchesData, fetching, error, operation }, reexecute] = useQuery({
    query: GET_ETCHES_FROM_USER_ETCHES_QUERY,
    variables: { userId },
  });

  const refetch = () => reexecute({ requestPolicy: "network-only" });

  const { setRefetchEtches } = useContext(refetchContext);
  useEffect(() => setRefetchEtches(refetch), [operation]);

  if (!etchesData) return { etches: [], isLoading: fetching, error };
  const etches = [
    ...etchesData.etches,
    ...etchesData.teams.flatMap((team: any) => [
      ...team.managedEtches.map((etch: any) => etch.etch),
      ...team.externalEtches.map((etch: any) => etch.etch),
    ]),
    ...etchesData.organisations.flatMap((org: any) =>
      org.managedTeams.flatMap((team: any) => [
        ...team.team.managedEtches.map((etch: any) => etch.etch),
        ...team.team.externalEtches.map((etch: any) => etch.etch),
      ])
    ),
  ];

  return { etches: removeDuplicatesByField(etches, "id"), isLoading: fetching, error, refetch };
};
