import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  EmailAddress: string;
  NonNegativeInt: number;
  PositiveFloat: number;
  PositiveInt: number;
  UUID: string;
};

export type Example = {
  __typename?: 'Example';
  grids?: Maybe<Array<Maybe<Grid>>>;
};

export type Grid = {
  __typename?: 'Grid';
  data?: Maybe<Array<Maybe<Array<Maybe<Scalars['Int']>>>>>;
  gridId: Scalars['ID'];
  height: Scalars['PositiveInt'];
  interpretAs: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  problemNumber: Scalars['PositiveInt'];
  width: Scalars['PositiveInt'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  authorID: Scalars['ID'];
  body: Scalars['String'];
  id: Scalars['ID'];
  published: Scalars['Boolean'];
  title: Scalars['String'];
  views?: Maybe<Scalars['NonNegativeInt']>;
};

export type ProblemInfo = {
  __typename?: 'ProblemInfo';
  description: Scalars['String'];
  hasArrays: Scalars['Boolean'];
  hasGraphs: Scalars['Boolean'];
  hasGrids: Scalars['Boolean'];
  numExamples: Scalars['PositiveInt'];
  problemId: Scalars['UUID'];
  problemNumber: Scalars['PositiveInt'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  grids?: Maybe<Array<Maybe<Grid>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  problem?: Maybe<ProblemInfo>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryProblemArgs = {
  number?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['PositiveFloat']>;
  email?: Maybe<Scalars['EmailAddress']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  name: Scalars['String'];
  posts?: Maybe<Array<Maybe<Post>>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  Example: ResolverTypeWrapper<Example>;
  Grid: ResolverTypeWrapper<Grid>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>;
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>;
  Post: ResolverTypeWrapper<Post>;
  ProblemInfo: ResolverTypeWrapper<ProblemInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  EmailAddress: Scalars['EmailAddress'];
  Example: Example;
  Grid: Grid;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  NonNegativeInt: Scalars['NonNegativeInt'];
  PositiveFloat: Scalars['PositiveFloat'];
  PositiveInt: Scalars['PositiveInt'];
  Post: Post;
  ProblemInfo: ProblemInfo;
  Query: {};
  String: Scalars['String'];
  UUID: Scalars['UUID'];
  User: User;
};

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  grids?: Resolver<Maybe<Array<Maybe<ResolversTypes['Grid']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GridResolvers<ContextType = any, ParentType extends ResolversParentTypes['Grid'] = ResolversParentTypes['Grid']> = {
  data?: Resolver<Maybe<Array<Maybe<Array<Maybe<ResolversTypes['Int']>>>>>, ParentType, ContextType>;
  gridId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>;
  interpretAs?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  problemNumber?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt';
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat';
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  authorID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['NonNegativeInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProblemInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProblemInfo'] = ResolversParentTypes['ProblemInfo']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasArrays?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasGraphs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasGrids?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  numExamples?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>;
  problemId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  problemNumber?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  grids?: Resolver<Maybe<Array<Maybe<ResolversTypes['Grid']>>>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  problem?: Resolver<Maybe<ResolversTypes['ProblemInfo']>, ParentType, ContextType, Partial<QueryProblemArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  age?: Resolver<Maybe<ResolversTypes['PositiveFloat']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailAddress']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  EmailAddress?: GraphQLScalarType;
  Example?: ExampleResolvers<ContextType>;
  Grid?: GridResolvers<ContextType>;
  NonNegativeInt?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  Post?: PostResolvers<ContextType>;
  ProblemInfo?: ProblemInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

